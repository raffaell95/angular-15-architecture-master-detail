import { Injectable, Injector } from '@angular/core';
import { Observable, catchError, map, mergeMap } from 'rxjs';
import { Entry } from './entry.model';
import { CategoryService } from '../../categories/shared/category.service';
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

  constructor(
    protected override injector: Injector,
    private categoryService: CategoryService
  ) { super('api/entries', injector, Entry.fromJson) }


  override create(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.create.bind(this))
  }

  override update(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.update.bind(this))
  }

  getByMonthAndYear(month: number, year: number): Observable<Entry[]>{
     return this.getAll().pipe(
      map(entries => this.filterByMonthAndYear(entries, month, year))
     )
  }

  private setCategoryAndSendToServer(entry: Entry, sendFn: any): Observable<any>{
    return this.categoryService.getById(Number(entry.categoryId)).pipe(
      mergeMap(category => {
        entry.category = category
        return sendFn(entry)
      }),
      catchError(this.handleError)
    )
  }

  private filterByMonthAndYear(entries: Entry[], month: number, year: number){
    return entries.filter((entry: any) =>{

      const entryDate = moment(entry.date, 'DD/MM/YYYY')
      const monthMatches = entryDate.month() + 1 == month
      const yearMatches = entryDate.year() == year

      if(monthMatches && yearMatches) return entry

    })
  }
  
}
