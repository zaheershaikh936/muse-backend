type InvoiceItem = {
    description: string
    price: string
    quantity: number
    totalPrice: string
}

type ClientInfo = {
    name: string
    email: string
    address: string
}

type PaymentInfo = {
    bankName: string
    accountName: string
    bankDetails: string
}

export type InvoiceData = {
    invoiceNumber: string
    invoiceDate: string
    status: string
    client: ClientInfo
    items: InvoiceItem[]
    subTotal: string
    total: string
    notes: string
    payment: PaymentInfo
    terms: string
    footer: string
}