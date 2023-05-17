import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Category } from './category.model';
import { BaseResourceService } from '../../../shared/services/base-resource.service';


@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseResourceService<Category> {
  constructor(protected override injector: Injector) {
    super('api/categories', injector, Category.fromJson)
  }
}