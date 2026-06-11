const fs = require('fs');
const path = require('path');
function fixFile(file, edits) {
    const fullPath = path.join(__dirname, 'src', file);
    if(!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    for (const [from, to] of edits) {
        content = content.split(from).join(to);
    }
    fs.writeFileSync(fullPath, content);
}

fixFile('app/(app)/expenses-purchases.tsx', [
    ['paymentMode as any', 'paymentMode as Expense["paymentMode"]'],
    ['t.id as any', 't.id as never'],
    ['t as any', 't as never']
]);

fixFile('app/(app)/gst-returns.tsx', [
    ['t as any', 't as never']
]);

fixFile('app/(app)/payment.tsx', [
    ['formData.mode as any', 'formData.mode as Payment["mode"]'],
    ['t.id as any', 't.id as never'],
    ['mode as any', 'mode as Payment["mode"]']
]);

fixFile('app/(app)/products-services.tsx', [
    ['t.id as any', 't.id as never']
]);

fixFile('app/(app)/sales.tsx', [
    ['t as any', 't as never'],
    ['} as any', '} as never'],
    ['route as any', 'route as never']
]);

fixFile('app/(app)/settings.tsx', [
    ['({ icon: Icon, title, subtitle, isDestructive = false }: any)', '({ icon: Icon, title, subtitle, isDestructive = false }: { icon: React.ElementType, title: string, subtitle?: string, isDestructive?: boolean })']
]);

fixFile('components/Button.tsx', [
    ['(e: any)', '(e: import("react-native").GestureResponderEvent)']
]);

fixFile('components/Card.tsx', [
    ['(e: any)', '(e: import("react-native").GestureResponderEvent)']
]);

fixFile('components/FloatingMenu.tsx', [
    ['href as any', 'href as never']
]);

fixFile('app/(app)/create-stock-adjustment.tsx', [
    ['r as any', 'r as StockAdjustment["reason"]']
]);
