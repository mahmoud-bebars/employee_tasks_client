import { useState, SyntheticEvent, useEffect } from "react";
import { Employee, ITask, Task } from "../common.types";

import { Button } from "../components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../features/tasks/tasksApiSlice";
import { Label } from "../components/ui/label";
import { DateTimePicker } from "../components/ui/date-picker";

import { Edit, LoaderCircle } from "lucide-react";

import { Textarea } from "./ui/textarea";

import moment from "moment";

import { useGetTasksQuery } from "../features/tasks/tasksApiSlice";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

type Props = {
  edit: boolean;
  task?: Task;
  selectedDate: Date;
  remainingHours: number;
  employee: Employee;
};

const TaskDialog = ({
  edit,
  selectedDate,
  remainingHours,
  task,
  employee,
}: Props) => {
  const { data: tasks } = useGetTasksQuery(employee.id);
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const [open, setOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [error, setError] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState<ITask>({
    description: task ? task.description : "",
    isCompleted: task ? task.isCompleted : false,
    from: task ? task.from : selectedDate,
    to: task ? task.to : new Date(),
  });

  useEffect(() => {
    const errMsg = `Total ${moment(selectedDate).format(
      "DD/MM/YYY",
    )} tasks duration
                exceeds 8 hours. Please adjust the time.`;
    const duration = moment
      .duration(moment(values.to).diff(moment(values.from)))
      .asHours();

    if (duration > remainingHours + 1 / 60 && !error.includes(errMsg)) {
      setIsDisabled(true);
      setError([...error, errMsg]);
    }

    if (duration < remainingHours + 1 / 60) {
      setIsDisabled(false);
      setError(error.filter((e) => e !== errMsg));
    }
  }, [values, remainingHours, error, selectedDate]);

  useEffect(() => {
    if (error.length > 0) {
      const timer = setTimeout(() => {
        setError([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    if (task) {
      // Update existing employee
      const result = await updateTask({ id: task.id, body: values });
      if (result.data) {
        // Handle successful update
        setOpen(false);
        setLoading(false);
      }
      setLoading(false);
    } else {
      // Create new employee
      const result = await createTask({ body: values, employee: employee.id });
      if (result.data) {
        // Handle successful creation
        setOpen(false);
        setLoading(false);
      }
      setLoading(false);
    }
  };

  const checkDuration = (from: Date, to: Date) => {
    const duration = moment.duration(moment(to).diff(moment(from)));
    const hours = duration.asHours();
    const errMsg1 =
      "Task duration cannot exceed 8 hours. Please adjust the time.";
    const errMsg2 = "From date is later than To date. Please adjust he dates.";
    if (hours > 8) {
      setIsDisabled(true);
      setError([...error, errMsg1]);
    } else {
      setIsDisabled(false);
      setError(error.filter((e) => e !== errMsg1));
    }
    if (moment(from).isAfter(to)) {
      setIsDisabled(true);
      setError([...error, errMsg2]);
    } else {
      setIsDisabled(false);
      setError(error.filter((e) => e !== errMsg2));
    }
  };

  const checkTotalDuration = (from: Date, to: Date) => {
    const selectedDate = moment(from).startOf("day");
    const tasksForDay =
      tasks?.data.filter(
        (t) => moment(t.from).isSame(selectedDate, "day") && t.id !== task?.id,
      ) || [];

    const totalDuration = moment.duration(moment(to).diff(from));
    tasksForDay.forEach((t: Task) => {
      totalDuration.add(moment.duration(moment(t.to).diff(t.from)));
    });
    const errMsg =
      "Total task duration for this day exceeds 8 hours. Please adjust the time.";
    if (parseInt(totalDuration.asHours().toFixed()) > 8) {
      setIsDisabled(true);
      setError([...error, errMsg]);
    } else {
      setIsDisabled(false);
      setError(error.filter((e) => e !== errMsg));
    }
  };

  const handleFromDateChange = (newFromDate: Date) => {
    setValues({ ...values, from: newFromDate });
    checkDuration(newFromDate, values.to);
    checkTotalDuration(newFromDate, values.to);
  };

  const handleToDateChange = (newToDate: Date) => {
    setValues({ ...values, to: newToDate });
    checkDuration(values.from, newToDate);
    checkTotalDuration(values.from, newToDate);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {edit ? (
          <Button variant="ghost" size="icon">
            <Edit className="size-4" />
          </Button>
        ) : (
          <Button variant="outline">New Task</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{edit ? "Edit Task" : "New Task"}</DialogTitle>
          <DialogDescription>
            {edit
              ? `edit task information from here`
              : "Add New Task for the Employee From here"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter the task Description here..."
              value={values.description}
              className="col-span-3"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="from" className="text-right">
              From Date
            </Label>
            <DateTimePicker
              hourCycle={12}
              value={moment(values.from).toDate()}
              className="col-span-3"
              onChange={(e) => {
                if (e) {
                  handleFromDateChange(e);
                }
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="from" className="text-right">
              To Date
            </Label>
            <DateTimePicker
              hourCycle={12}
              value={moment(values.to).toDate()}
              className="col-span-3"
              onChange={(e) => {
                if (e) {
                  handleToDateChange(e);
                }
              }}
            />
          </div>

          {error.length > 0 && (
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error.map((e) => (
                  <p>{e}</p>
                ))}
              </AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isDisabled || loading || values.description === ""}
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
export default TaskDialog;
