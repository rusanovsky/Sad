import { Injectable } from "@angular/core";

import { Socket } from "ngx-socket-io";

import { Document } from "../models/document";

import axios from 'axios'; 

@Injectable({
  providedIn: "root",
})
export class DocumentService {
  currentDocument = this.socket.fromEvent<Document>("document");
  documents = this.socket.fromEvent<string[]>("documents");

  constructor(private socket: Socket) {}

  saveDocument(name: string, text: string) {
    axios
      .post("http://localhost:4444/docs/add", {
        name: name,
        text: text,
      })
      .then((res) => console.log(res.data));
  }

  deleteDocument(id: string) {
    axios
      .delete("http://localhost:4444/docs/")
      .then((res) => console.log(res.data));
  }

  getDocument(id: string) {
    this.socket.emit("getDoc", id);
  }

  newDocument() {
    this.socket.emit("addDoc", { id: this.docId(), doc: "" });
  }

  editDocument(document: Document) {
    this.socket.emit("editDoc", document);
  }

  private docId() {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
}
