import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable, Subscription } from "rxjs";

import { DocumentService } from "src/app/services/document.service";
import { DocumentComponent } from "src/app/components/document/document.component";

import { Document } from "../../models/document";

@Component({
  selector: "app-document-list",
  templateUrl: "./document-list.component.html",
  styleUrls: ["./document-list.component.scss"],
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents: Observable<string[]>;
  document: Document;
  currentDoc: string;
  private _docSub: Subscription;

  constructor(
    private documentService: DocumentService,
    private documentComponent: DocumentComponent
  ) {}

  ngOnInit() {
    this.documents = this.documentService.documents;
    this._docSub = this.documentService.currentDocument.subscribe(
      (doc) => (this.currentDoc = doc.id)
    );
    this.document = this.documentComponent.document;
  }

  ngOnDestroy() {
    this._docSub.unsubscribe();
  }

  loadDoc(id: string) {
    this.documentService.getDocument(id);
  }

  newDoc() {
    this.documentService.newDocument();
  }

  deleteDoc(id: string) {
    this.documentService.deleteDocument(id);
  }

  saveDoc(name: string) {
    this.documentService.saveDocument(name, this.documentComponent.str);
  }
}
