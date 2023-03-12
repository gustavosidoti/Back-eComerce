import { Schema, model } from "mongoose";

const messagesCollection = "messages";

const messagesSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

messagesSchema.method('toJSON', function() {

    const { // quitamos lo que no queremos devolver luego del post
        __v,
        _id,
        ...object
    } = this.toObject();
    object.mid = _id;
    return object;
});

export const messagesModel = model(messagesCollection, messagesSchema);