import {
  useDeleteEmployeeMutation,
  useGetEmployeesQuery,
} from "./employeesApiSlice";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import EmplyeeDialog from "../../components/emplyee-dialog";
import { Trash2 } from "lucide-react";
import { Employee } from "../../common.types";

type Props = {
  setSelectedEmployee: (employee: Employee) => void;
};

export const Employees = ({ setSelectedEmployee }: Props) => {
  const [deleteEmployee] = useDeleteEmployeeMutation();
  // Using a query hook automatically fetches data and returns query values
  const { data, isError, isLoading, isSuccess } = useGetEmployeesQuery();

  if (isError) {
    return (
      <div>
        <h1>There was an error!!!</h1>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <Card className="">
        <CardHeader className="w-full flex flex-row items-center justify-between">
          <div className="grid gap-2">
            <CardTitle>Employees</CardTitle>
            <CardDescription>
              Here you can see the list of employees.
            </CardDescription>
          </div>
          <EmplyeeDialog edit={false} />
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>
              {data.data.length > 0
                ? `A list of Your Employees`
                : `No Employees Avalaible to Show`}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>

                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="font-medium">{employee.name}</div>
                  </TableCell>

                  <TableCell className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      View Tasks
                    </Button>
                    <EmplyeeDialog edit={true} employee={employee} />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteEmployee(employee.id)}
                    >
                      <Trash2 className="size-4 text-red-800" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  return null;
};
