const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
} = require('@aws-sdk/lib-dynamodb')

let documentClient

const getClient = () => {
  if (!documentClient) {
    const client = new DynamoDBClient({ region: process.env.AWS_REGION })
    documentClient = DynamoDBDocumentClient.from(client)
  }
  return documentClient
}

const baseParams = () => ({
  TableName: process.env.DYNAMO_APPLICATION_TABLE,
})

const database = {
  async write(params) {
    const command = new PutCommand({ ...baseParams(), ...params })
    return getClient().send(command)
  },

  async update(params) {
    const command = new UpdateCommand({ ...baseParams(), ...params })
    return getClient().send(command)
  },

  async remove(params) {
    const command = new DeleteCommand({ ...baseParams(), ...params })
    return getClient().send(command)
  },

  async query(params) {
    const command = new QueryCommand({ ...baseParams(), ...params })
    return getClient().send(command)
  },

  async scan(params) {
    const command = new ScanCommand({ ...baseParams(), ...params })
    return getClient().send(command)
  },
}

module.exports = database