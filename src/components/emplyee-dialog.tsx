import { useState, SyntheticEvent } from "react";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Edit, LoaderCircle } from "lucide-react";
import { Employee, IEmployee } from "../common.types";

type Props = {
  edit: boolean;
  employee?: Employee;
};

import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from "../features/employees/employeesApiSlice";

const EmplyeeDialog = ({ edit, employee }: Props) => {
  const [createEmployee] = useCreateEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<IEmployee>({
    name: employee ? employee.name : "",
  });

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    if (employee) {
      // Update existing employee
      const result = await updateEmployee({ id: employee.id, body: values });
      if (result.data) {
        // Handle successful update
        setOpen(false);
        setLoading(false);
      }
      setLoading(false);
    } else {
      // Create new employee
      const result = await createEmployee(values);
      if (result.data) {
        // Handle successful creation
        setOpen(false);
        setLoading(false);
      }
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {edit ? (
          <Button variant="ghost" size="icon">
            <Edit className="size-4" />
          </Button>
        ) : (
          <Button variant="outline">New Employee</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{edit ? employee?.name : "New Employee"}</DialogTitle>
          <DialogDescription>
            {edit
              ? `edit ${employee?.name} information from here`
              : "Add New Employee From here"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={values.name}
              className="col-span-3"
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            disabled={values.name === "" || loading}
            onClick={handleSubmit}
            className="flex items-center gap-2"
          >
            {loading && <LoaderCircle className=" animate-spin size-4" />}
            {edit ? "Save Changes" : loading ? "Submitting..." : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmplyeeDialog;
