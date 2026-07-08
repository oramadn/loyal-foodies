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
import type { OrderSnapshot } from "@/types";

type Props = {
  entries: OrderSnapshot["entries"];
  totalOwed: string;
  payerName: string;
};

export function OrderSummaryTable({ entries, totalOwed, payerName }: Props) {
  if (entries.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-4 text-center">
        No orders yet — be the first to add yours!
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Items</TableHead>
          <TableHead className="text-right">Owes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell className="font-medium whitespace-nowrap">
              {entry.name}
            </TableCell>
            <TableCell className="text-muted-foreground">{entry.items}</TableCell>
            <TableCell className="text-right whitespace-nowrap">
              {formatCurrency(entry.amount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2} className="font-semibold">
            Total owed to {payerName}
          </TableCell>
          <TableCell className="text-right font-semibold">
            {formatCurrency(totalOwed)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
