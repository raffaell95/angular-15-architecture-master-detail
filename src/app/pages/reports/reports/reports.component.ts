import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Category } from '../../categories/shared/category.model';
import { Entry } from '../../entries/shared/entry.model';
import { EntryService } from '../../entries/shared/entry.service';
import { CategoryService } from '../../categories/shared/category.service';
import * as currencyFormatter from 'currency-formatter'

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  expenseTotal: number | string = 0
  revenueTotal: number | string = 0
  balance: number | string = 0

  expenseChartData: any
  revenueChartData: any

  chartOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  }

  categories: Category[] = []
  entries: Entry[] = []

  @ViewChild('month') month?: ElementRef<any>
  @ViewChild('year') year?: ElementRef<any>

  constructor(
    private entryService: EntryService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(category => this.categories = category)
  }

  generateReports() {
    const month = this.month?.nativeElement.value
    const year = this.year?.nativeElement.value

    if (!month || !year)
      alert('Voce precisa selecionar o mes e o ano para gerar os relatorios')
    else
      this.entryService.getByMonthAndYear(month, year).subscribe(this.setValues.bind(this))

  }

  private setValues(entries: Entry[]) {
    this.entries = entries
    this.calculateBalance()
    this.setChartData()
  }

  private calculateBalance() {
    let expenseTotal = 0
    let revenueTotal = 0
    this.entries.forEach(entry => {
      if (entry.type == 'revenue')
        revenueTotal += currencyFormatter.unformat(entry.amount as string, { code: 'BRL' })
      else
        expenseTotal += currencyFormatter.unformat(entry.amount as string, { code: 'BRL' })
    })

    this.expenseTotal = currencyFormatter.format(expenseTotal, { code: 'BRL' })
    this.revenueTotal = currencyFormatter.format(revenueTotal, { code: 'BRL' })

    this.balance = currencyFormatter.format(revenueTotal - expenseTotal, { code: 'BRL' })

  }

  private setChartData() {
    this.revenueChartData = this.getChartData('revenue', 'Grafico de Receitas', '#9CCC65')
    this.expenseChartData = this.getChartData('expense', 'Grafico de Despesas', '#E03131')
  }

  private getChartData(entryType: string, title: string, color: string){
    const chartData: any[] = []
    this.categories.forEach(category => {
      const filteredEntries = this.entries.filter(entry =>
        (entry.categoryId == category.id) && (entry.type == entryType))

      if (filteredEntries.length > 0) {
        const totalAmount = filteredEntries.reduce((total, entry) =>
          total + currencyFormatter.unformat(entry.amount as string, { code: 'BRL' }), 0)

        chartData.push({
          categoryName: category.name,
          totalAmount: totalAmount
        })
      }
    })

    return {
      labels: chartData.map(item => item.categoryName),
      datasets: [
        {
          label: title,
          backgroundColor: color,
          data: chartData.map(item => item.totalAmount)
        }
      ]
    }
  }

}
