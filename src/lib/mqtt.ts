import mqtt from 'mqtt'
import { MenuCategory } from '@/types/menu-category'
import { MenuItem } from '@/types/menu-item'
import { processOrder } from './order-processor'

const MQTT_BROKER = 'tcp://mdm.tee108.org:1883'
const MQTT_TOPICS = {
  menuCategory: 'menu/category',
  menuItems: 'menu/update',
  orders: 'menu/order',
} as const

const MQTT_OPTIONS = {
  keepalive: 30,
  connectTimeout: 5000,
  reconnectPeriod: 5000,
  clean: true,
  clientId: `admin_dashboard_${Math.random().toString(16).substring(2, 10)}`,
} as const

let mqttClient: mqtt.MqttClient | null = null
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 5

async function connectToMqtt(): Promise<mqtt.MqttClient> {
  return new Promise((resolve, reject) => {
    if (mqttClient && mqttClient.connected) {
      console.log('[MQTT] Using existing connection')
      resolve(mqttClient)
      return
    }

    // Clean up existing client
    if (mqttClient) {
      try {
        mqttClient.end(true)
      } catch (error) {
        console.error('[MQTT] Error cleaning up client:', error)
      }
      mqttClient = null
    }

    console.log('[MQTT] Attempting to connect...')
    mqttClient = mqtt.connect(MQTT_BROKER, MQTT_OPTIONS)

    const connectTimeout = setTimeout(() => {
      if (mqttClient && !mqttClient.connected) {
        console.error('[MQTT] Connection timeout')
        mqttClient.end(true)
      }
    }, MQTT_OPTIONS.connectTimeout)

    mqttClient.on('connect', () => {
      clearTimeout(connectTimeout)
      console.log('[MQTT] Successfully connected')
      reconnectAttempts = 0
      resolve(mqttClient!)
    })

    mqttClient.on('error', (error) => {
      clearTimeout(connectTimeout)
      console.error('[MQTT] Connection error:', error)
      if (!mqttClient?.connected) {
        reject(error)
      }
    })

    mqttClient.on('close', () => {
      console.log('[MQTT] Connection closed')
      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error('[MQTT] Max reconnection attempts reached')
        mqttClient?.end(true)
        return
      }
      reconnectAttempts++
    })

    mqttClient.on('offline', () => {
      console.log('[MQTT] Client went offline')
    })

    mqttClient.on('reconnect', () => {
      console.log(
        `[MQTT] Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`
      )
    })
  })
}

async function publishToTopic<T>(topic: keyof typeof MQTT_TOPICS, data: T) {
  try {
    const client = await connectToMqtt()
    const message = JSON.stringify(data)

    return new Promise<void>((resolve, reject) => {
      client.publish(MQTT_TOPICS[topic], message, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  } catch (error) {
    throw error
  }
}

// Add a flag to track subscription status
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const subscriptions = new Map<string, Set<(data: any) => void>>()

export async function subscribeToTopic<T>(
  topic: keyof typeof MQTT_TOPICS,
  callback: (data: T) => void
) {
  try {
    const client = await connectToMqtt()
    const topicName = MQTT_TOPICS[topic]

    // Initialize topic subscribers set if not exists
    if (!subscriptions.has(topicName)) {
      subscriptions.set(topicName, new Set())

      // Subscribe only once per topic
      client.subscribe(topicName, { qos: 1 }, (err) => {
        if (err) {
          console.error('[MQTT] Subscribe error:', err)
          throw err
        }
        console.log('[MQTT] Successfully subscribed to:', topicName)
      })
    }

    // Add callback to subscribers
    subscriptions.get(topicName)?.add(callback)

    // Update message handling
    client.on('message', (receivedTopic: string, message: Buffer) => {
      const subscribers = subscriptions.get(receivedTopic)
      if (subscribers) {
        try {
          const data = JSON.parse(message.toString())
          subscribers.forEach((cb) => cb(data))
        } catch (error) {
          console.error('[MQTT] Error parsing message:', error)
        }
      }
    })

    return () => {
      subscriptions.get(topicName)?.delete(callback)
    }
  } catch (error) {
    console.error('[MQTT] Subscription error:', error)
    throw error
  }
}

export const publishMenuCategories = (categories: MenuCategory[]) =>
  publishToTopic('menuCategory', categories)

export const publishMenuItems = (items: MenuItem[]) =>
  publishToTopic('menuItems', items)

export async function subscribeToOrders() {
  return subscribeToTopic('orders', async (orderData) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const typedOrderData = orderData as any
      await processOrder(typedOrderData)
    } catch (error) {
      console.error('[MQTT] Error processing order:', error)
    }
  })
}

let isInitialized = false

export async function initializeMQTT() {
  if (isInitialized) return

  try {
    const response = await fetch('/api/mqtt/initialize', {
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error('Failed to initialize MQTT')
    }

    isInitialized = true
  } catch (error) {
    console.error('Error initializing MQTT:', error)
    isInitialized = false
  }
}

// Remove the automatic initialization
// if (typeof window === 'undefined') {
//   initializeMQTT()
// }
