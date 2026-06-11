import fs from 'fs';
import path from 'path';

let text = fs.readFileSync(path.join(__dirname, '../src/app/(app)/(purchases)/expenses-purchases.tsx'), 'utf-8');

// The file was restored from git, so it has original data structure references.
text = text.replace(/Expense/g, 'ExpenseRecord');
text = text.replace(/Invoice/g, 'PurchaseOrder'); // for purchases
text = text.replace(/\.amount(?!\w)/g, '.amountPaise');
text = text.replace(/\.total(?!\w)/g, '.totalAmountPaise');
text = text.replace(/\.customerName/g, '.partyName');
text = text.replace(/\.number/g, '.documentNumber');
text = text.replace(/\.date/g, '.documentDate'); // PurchaseOrder uses documentDate
text = text.replace(/ExpenseRecordRecord/g, 'ExpenseRecord');
text = text.replace(/PurchaseOrderRecord/g, 'PurchaseOrder');
text = text.replace(/exp\.documentDate/g, 'exp.date'); // ExpenseRecord uses date
text = text.replace(/editingExpenseRecord\.documentDate/g, 'editingExpense.date');
text = text.replace(/ExpenseRecord FormData/g, 'Expense FormData');
text = text.replace(/Add ExpenseRecord/g, 'Add Expense');
text = text.replace(/Delete ExpenseRecord/g, 'Delete Expense');
text = text.replace(/PurchaseOrder FormData/g, 'Purchase FormData');

fs.writeFileSync(path.join(__dirname, '../src/app/(app)/(purchases)/expenses-purchases.tsx'), text, 'utf-8');

console.log("Fixed 14");
