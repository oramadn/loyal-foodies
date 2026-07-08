import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import type { OrderSnapshot, SharedCost } from "@/types";

type Props = {
  entries: OrderSnapshot["entries"];
  totalOwed: string;
  payerName: string;
  sharedCosts?: SharedCost[];
};

export function OrderSummaryTable({ entries, totalOwed, payerName, sharedCosts }: Props) {
  if (entries.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-4 text-center">
        No orders yet — be the first to add yours!
      </p>
    );
  }

  const hasSharedCosts = sharedCosts && sharedCosts.length > 0;
  const totalFees = hasSharedCosts
    ? sharedCosts.reduce((s, c) => s + c.amount, 0)
    : 0;
  const feePerPerson = entries.length > 0 ? totalFees / entries.length : 0;
  const grandTotal = parseFloat(totalOwed) + totalFees;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Items</TableHead>
          <TableHead className="text-right">Food</TableHead>
          {hasSharedCosts && (
            <>
              <TableHead className="text-right whitespace-nowrap">+ Fee share</TableHead>
              <TableHead className="text-right font-semibold">= Total</TableHead>
            </>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((entry) => {
          const food = entry.amount ? parseFloat(entry.amount) : null;
          const personTotal = food !== null ? food + feePerPerson : null;
          return (
            <TableRow key={entry.id}>
              <TableCell className="font-medium whitespace-nowrap">{entry.name}</TableCell>
              <TableCell className="text-muted-foreground">{entry.items}</TableCell>
              <TableCell className="text-right whitespace-nowrap">
                {formatCurrency(entry.amount)}
              </TableCell>
              {hasSharedCosts && (
                <>
                  <TableCell className="text-right whitespace-nowrap text-muted-foreground">
                    {formatCurrency(feePerPerson)}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap font-semibold">
                    {formatCurrency(personTotal)}
                  </TableCell>
                </>
              )}
            </TableRow>
          );
        })}
      </TableBody>
      <TableFooter>
        {hasSharedCosts ? (
          <>
            <TableRow className="text-muted-foreground text-xs">
              <TableCell colSpan={2}>Subtotal (food)</TableCell>
              <TableCell className="text-right">{formatCurrency(totalOwed)}</TableCell>
              <TableCell className="text-right">{formatCurrency(totalFees)}</TableCell>
              <TableCell />
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} className="font-semibold">
                Grand total owed to {payerName}
              </TableCell>
              <TableCell />
              <TableCell />
              <TableCell className="text-right font-semibold">
                {formatCurrency(grandTotal)}
              </TableCell>
            </TableRow>
          </>
        ) : (
          <TableRow>
            <TableCell colSpan={2} className="font-semibold">
              Total owed to {payerName}
            </TableCell>
            <TableCell className="text-right font-semibold">
              {formatCurrency(totalOwed)}
            </TableCell>
          </TableRow>
        )}
      </TableFooter>
    </Table>
  );
}
