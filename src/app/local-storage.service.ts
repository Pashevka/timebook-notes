import { Injectable } from '@angular/core';
class note {
  id: string;
  name: string;
  priority: string;
  date: string;
  showedDate: string;
  constructor(id: string, name: string, priority: string, date: string) {
    this.id = id;
    this.name = name;
    this.priority = priority;
    this.date = date;
    this.showedDate = this.formatDate(this.date);
  }
  formatDate(_date) {
    let date = new Date(_date);
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }
  getId() {
    return this.id;
  }
  setName(name: string) {
    this.name = name;
  }
  setPriority(priority: string) {
    this.priority = priority;
  }
  setDate(date: string) {
    this.date = date;
  }

}
@Injectable({
  providedIn: 'root'
})

export class LocalStorageService {

  constructor() {

  }
  GetNotes(): note[] {
    let notes: string;
    try {
      notes = localStorage.getItem('notes');
      if (notes == null) return [];
    } catch (error) {
      console.log('Error when trying to get notes');
      console.log(error);
      return [];
    }
    //уверен тут есть решение поизящнее, я пробовал через reviwer в parse методе, не вышло
    let parsedNotes: note[] = JSON.parse(notes);
    let classedNotes: note[] = [];
    for (let i = 0; i < parsedNotes.length; i++) {
      const nDate = parsedNotes[i].date;
      const nName = parsedNotes[i].name;
      const nId = parsedNotes[i].id;
      let nPriority = parsedNotes[i].priority;
      classedNotes.push(new note(nId, nName, nPriority, nDate))
    }
    return classedNotes;

  }
  CreateNote(name: string, priority: string, date: string, notesArr?: note[]) {
    const id = this.getUniqId();
    let notes: note[] = [];
    (notesArr != undefined) ? notes = notesArr : notes = this.GetNotes();
    if (notes.filter((item) => {
      return item.getId() == id;
    }).length > 0) {
      this.CreateNote(name, priority, date, notes);
    }
    notes.push(new note(id, name, priority, date));
    try {
      localStorage.setItem('notes', JSON.stringify(notes));
      return true;
    } catch (error) {
      console.log('Error when trying to create note');
      console.log(error);
      return false;
    }
  }

  ReadNote(id: string) {
    let notes: note[] = this.GetNotes();
    let FilteredNotes = notes.filter((item) => {
      return item.getId() == id;
    })
    if (FilteredNotes.length > 0) {
      return FilteredNotes[0];
    } else {
      return null;
    }
  }
  UpdateNote(id: string, name: string, priority: string, date: string) {
    let notes: note[] = this.GetNotes();
    let updatedNote = null;
    notes.some((item, i) => {
      if (item.getId() == id) {
        item.setName(name);
        item.setPriority(priority);
        item.setDate(date);
        updatedNote = item;
        return true;
      } else {
        return false;
      }
    })
    localStorage.setItem("notes", JSON.stringify(notes));
    return updatedNote;
  }
  DeleteNote(id): note {
    let almostDeletedNote: note = this.ReadNote(id);
    let deleted = this.removeNote(almostDeletedNote);
    return deleted;
  }
  getUniqId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
  removeNote(note: note): note {
    let arr = this.GetNotes();
    let deleted: note = null;
    arr.forEach((item, index) => {
      if (item.id === note.id) {
        arr.splice(index, 1);
        deleted = item;
      }
    });
    localStorage.setItem("notes", JSON.stringify(arr));
    return deleted;
  }


}
