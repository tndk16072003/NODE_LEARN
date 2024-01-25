import { ObjectId } from 'mongodb'

export default class Hashtag {
  _id: ObjectId
  name: string
  created_at: Date
  constructor({ _id, name, created_at }: { _id?: ObjectId; name: string; created_at?: Date }) {
    this._id = _id || new ObjectId()
    this.name = name
    this.created_at = created_at || new Date()
  }
}
