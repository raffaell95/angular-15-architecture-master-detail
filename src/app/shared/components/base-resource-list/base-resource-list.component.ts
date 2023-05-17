import { Directive, OnInit } from '@angular/core';
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';


@Directive()
export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  resources: T[] = []

  constructor(private resourceService: BaseResourceService<T>) { }

  ngOnInit(): void {
    this.resourceService.getAll().subscribe({
      next: resources => this.resources = resources.sort((a, b) => Number(b.id) - Number(a.id)),
      error: () => alert('Erro ao carregar categorias')
    })

  }

  deleteResource(resource: T) {
    const mustDelete = confirm('Deseja realmente exluir este item?')
    if (mustDelete) {
      this.resourceService.delete(Number(resource.id)).subscribe({
        next: () => this.resources = this.resources.filter(element => element != resource),
        error: () => alert('Erro ao tentar excluir')
      })
    }
  }

}
