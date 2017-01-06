import { shell } from 'electron';
import { readdir, stat } from 'fs';
import { resolve } from 'path';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {
  private currentPath: string = process.cwd();
  private entries: Array<string>;

  constructor() {
    this.updateEntries();
  }

  ngOnInit() {}

  private updateEntries() {
    readdir(this.currentPath, (err: Error, files: [string]) => {
      if (err) {
        return console.error(err);
      }

      this.entries = ['../'].concat(files);
    });
  }

  private changeDir(newDir: string) {
    const targetPath = resolve(this.currentPath, newDir);
    stat(targetPath, (err, stats) => {
      if (err) {
        console.error(err);
      }

      if (stats.isFile()) {
        this.openFile(targetPath);
      } else if (stats.isDirectory()) {
        this.currentPath = targetPath;
        this.updateEntries();
      } else {
        console.error(new Error(`Unknown file system object: ${targetPath}`));
      }
    });
  }

  private openFile(path: string) {
    shell.openItem(path);
  }
}
