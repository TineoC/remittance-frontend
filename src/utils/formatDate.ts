export const formatDate = (date: Date): string => 
    date.toLocaleString("es-RD", { hourCycle:'h12' });