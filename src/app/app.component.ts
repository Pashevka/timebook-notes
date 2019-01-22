import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MAT_DATE_LOCALE } from '@angular/material';
import { LocalStorageService } from './local-storage.service';
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
export interface notes {
  id: string;
  name: string;
  priority: string;
  date: string;
}
export interface DialogData {
  id: string
  name: string;
  priority: string;
  date: string;
}

export interface Priorities {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [LocalStorageService]
})
export class AppComponent {
  displayedColumns: string[] = ['name', 'priority', 'date'];
  dataSource: MatTableDataSource<notes>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  id: string;
  name: string;
  priority: string;
  date: string;
  constructor(public dialog: MatDialog, public storageService: LocalStorageService) {
    const users = this.ShowUsers();
    this.dataSource = new MatTableDataSource(users);
  }
  getRecord(row) {
    console.log(row);
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '500px',
      data: {
        id: row.id,
        name: row.name,
        priority: row.priority,
        date: row.date
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.dataSource = new MatTableDataSource(this.ShowUsers());
    });
  }
 
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '500px',
      data: {
        id: this.id,
        name: this.name,
        priority: this.priority,
        date: this.date
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.dataSource = new MatTableDataSource(this.ShowUsers());
    });
  }
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ShowUsers(): note[] {
    return this.storageService.GetNotes()

  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    LocalStorageService
  ],
})
export class DialogOverviewExampleDialog {

  constructor(
    public storageService: LocalStorageService,
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }
  action = 'Create';
  showDeleteBtn = true;
  mode = 0;
  options: Priorities[] = [
    {
      value: 'High', viewValue: 'High'
    },
    {
      value: 'Medium', viewValue: 'Medium'
    },
    {
      value: 'Low', viewValue: 'Low'
    }
  ]
  ngOnInit() {
    if (this.data.id == undefined) {
      this.action = "Create";
      this.showDeleteBtn = false;
      this.mode = 0;
    } else {
      this.action = 'Update';
      this.showDeleteBtn = true;
      this.mode = 1;
    }
  }
  onNoClick(): void {
    console.log(this.data);

    if (this.data.id != undefined) {
      this.storageService.DeleteNote(this.data.id);
    }
    this.dialogRef.close('closed');
  }
  onOkClick(): void {
    console.log(this.data);
    const id = this.data.id;
    const name = this.data.name;
    const priority = this.data.priority;
    const date = this.data.date;
    if (this.mode == 0) {
      this.storageService.CreateNote(name, priority, date);
    } else {
      this.storageService.UpdateNote(id, name, priority, date);

    }
    this.dialogRef.close();
  }

}

