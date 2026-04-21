import { lusitana } from "@/app/ui/fonts"
import { fetchCardData, fetchLatestInvoices, fetchRevenue } from "@/app/lib/data"
import RevenueChart from "@/app/ui/dashboard/revenue-chart"
import LatestInvoices from "@/app/ui/dashboard/latest-invoices"
import { Card } from "@/app/ui/dashboard/cards"

export default async function Page() {
    // Fetch data in parallel
    const data = await Promise.all([fetchRevenue(), fetchLatestInvoices(), fetchCardData()])
    // get the data of the dashboard page
    const revenue = data[0]
    const latestInvoices = data[1]
    const cardData = data[2]
    //Use previous data to collect statistics
    const totalPaidInvoices = cardData.totalPaidInvoices
    const totalPendingInvoices = cardData.totalPendingInvoices
    const numberOfInvoices = cardData.numberOfInvoices
    const numberOfCustomers = cardData.numberOfCustomers

    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card title="Collected" value={totalPaidInvoices} type="collected" />
                <Card title="Pending" value={totalPendingInvoices} type="pending" />
                <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
                <Card title="Total Customers" value={numberOfCustomers} type="customers" />
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <RevenueChart revenue={revenue}  />
                <LatestInvoices latestInvoices={latestInvoices} />
            </div>
        </main>
    )
}