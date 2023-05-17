import { Component, Input } from '@angular/core';


interface BreadCrumpItem{
  text: string,
  link?: string
}

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.scss']
})
export class BreadCrumbComponent {

  @Input() items: Array<BreadCrumpItem> = []

  constructor(){}

  isTheLastItem(item: BreadCrumpItem): boolean{
    const index = this.items.indexOf(item)
    return index + 1 == this.items.length
  }

}
