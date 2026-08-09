import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPercent } from "@/lib/utils";
import type { BarberOccupation } from "@/types/api";

export function OccupancyTable({ data }: { data: BarberOccupation[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Barbeiro</TableHead>
            <TableHead>Reservados</TableHead>
            <TableHead>Disponíveis</TableHead>
            <TableHead>Ocupação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.barberId}>
              <TableCell>{item.barberName}</TableCell>
              <TableCell>{item.bookedSlots}</TableCell>
              <TableCell>{item.availableSlots}</TableCell>
              <TableCell>{formatPercent(item.occupancyRate)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
