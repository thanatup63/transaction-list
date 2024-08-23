import { Component } from '@angular/core';

interface ExpenseRecord {
  date: string;
  category: string;
  details: string;
  amount: number;
}

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent {
  showModal: boolean = false;
  categories: string[] = ['เลือกหมวดหมู่', 'ปุ๋ย', 'ฮอร์โมน', 'ยาฆ่าแมลง', 'ค่าแรง', 'ค่าน้ำ', 'ค่าไฟ', 'เครื่องมือ', 'เชื้อเพลิง', 'ขนส่ง', 'ซ่อมแซม', 'อื่น ๆ'];

  startDate: string = ''; // สำหรับกรองข้อมูลตามวันที่เริ่มต้น
  endDate: string = '';   // สำหรับกรองข้อมูลตามวันที่สิ้นสุด

  newExpense: ExpenseRecord = {
    category: '',
    amount: 0,
    date: '',
    details: ''
  };

  records: ExpenseRecord[] = [
    { date: '2024-08-03', category: 'ปุ๋ย', details: 'ซื้อปุ๋ยสำหรับแปลงที่ 1', amount: 5000 },
    { date: '2024-08-01', category: 'ซ่อมแซมเครื่องจักร', details: 'ซ่อมเครื่องจักรการเก็บเกี่ยว', amount: 12000 },
    { date: '2024-07-28', category: 'เชื้อเพลิง', details: 'เติมน้ำมันสำหรับแปลงที่ 2', amount: 3500 },
    { date: '2024-07-25', category: 'ยาฆ่าแมลง', details: 'ซื้อยาฆ่าแมลงสำหรับแปลงที่ 3', amount: 2000 },
    // เพิ่มข้อมูลอื่นๆ เพื่อทดสอบ Pagination
  ];

  pagedRecords: ExpenseRecord[] = [];
  currentPage = 1;
  pageSize = 3; // จำนวนรายการต่อหน้า
  totalPages = Math.ceil(this.records.length / this.pageSize);
  pagination: number[] = [];

  ngOnInit() {
    this.renderTable(this.currentPage);
    this.updatePagination();
  }

  openPopup() {
    this.showModal = true;
  }

  closePopup() {
    this.showModal = false;
    this.clearForm();
  }

  addRecord() {
    this.records.push({ ...this.newExpense });
    this.totalPages = Math.ceil(this.records.length / this.pageSize);
    this.renderTable(this.currentPage);
    this.updatePagination();
    this.closePopup();
  }

  clearForm() {
    this.newExpense = {
      category: '',
      amount: 0,
      date: '',
      details: ''
    };
  }

  renderTable(page: number) {
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;

    if (this.records.length > 0) {
      this.pagedRecords = this.records.slice(start, end);
    } else {
      this.pagedRecords = [];
    }
  }

  updatePagination() {
    this.pagination = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pagination.push(i);
    }
  }

  changePage(direction: number) {
    if (direction === -1 && this.currentPage > 1) {
      this.currentPage--;
    } else if (direction === 1 && this.currentPage < this.totalPages) {
      this.currentPage++;
    }
    this.renderTable(this.currentPage);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.renderTable(this.currentPage);
  }

  filterTable() {
    const filteredRecords = this.records.filter(record => {
      const recordDate = new Date(record.date);
      const startDate = this.startDate ? new Date(this.startDate) : null;
      const endDate = this.endDate ? new Date(this.endDate) : null;

      const inDateRange = (!startDate || recordDate >= startDate) &&
                          (!endDate || recordDate <= endDate);

      return inDateRange;
    });

    this.pagedRecords = filteredRecords.slice(0, this.pageSize);
    this.currentPage = 1;
    this.totalPages = Math.ceil(filteredRecords.length / this.pageSize);
    this.updatePagination();
  }
}
