import moment from "moment";

import { Employee, Task } from "../../common.types";

import { useDeleteTaskMutation, useGetTasksQuery } from "./tasksApiSlice";

import TaskDialog from "../../components/task-dialog";

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

import { LoaderCircle, Trash2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import DateSelector from "../../components/date-selector";

type Props = {
  employee: Employee;
  onClose: () => void;
};
const MAX_WORK_HOURS_PER_DAY = 8; // we can adjust this value as needed

export const Tasks = ({ employee, onClose }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Using a query hook automatically fetches data and returns query values
  const { data, isError, isLoading, isSuccess } = useGetTasksQuery(
    employee?.id,
  );

  if (isError) {
    return (
      <div className="w-full flex justify-center items-center h-full">
        <h1 className="text-red-800 font-bold">There was an error!!!</h1>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center h-full">
        <LoaderCircle className=" animate-spin size-32" />
      </div>
    );
  }

  if (isSuccess) {
    const calculateTotalHours = (tasks: Task[]) => {
      return tasks.reduce((total, task) => {
        const start = moment(task.from);
        const end = moment(task.to);
        const duration = moment.duration(end.diff(start));
        return total + duration.asHours();
      }, 0);
    };

    const filteredTasks = data.data.filter(
      (task) =>
        moment(task.from).format("DD/MM/YYYY") ===
        moment(selectedDate).format("DD/MM/YYYY"),
    );

    const totalHours = calculateTotalHours(filteredTasks);

    const remainingHours = Math.max(0, MAX_WORK_HOURS_PER_DAY - totalHours);

    return (
      <Card className="">
        <CardHeader className="w-full flex flex-row items-center justify-between">
          <div className="grid gap-2">
            <CardTitle>
              {employee.name} Tasks for{" "}
              {moment(selectedDate).format("DD/MM/YYYY")}{" "}
            </CardTitle>
            <CardDescription>
              Here you can see {employee.name} Tasks
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <DateSelector
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />

            <TaskDialog
              edit={false}
              employee={employee}
              selectedDate={selectedDate}
              remainingHours={remainingHours}
            />
            <Button size="icon" variant="ghost" onClick={onClose}>
              <XCircle className="size-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-between">
            <div>
              <strong>Total Hours Allocated:</strong> {totalHours.toFixed(2)}{" "}
              hours
            </div>
            <div>
              <strong>Remaining Hours:</strong> {remainingHours.toFixed(2)}{" "}
              hours
            </div>
          </div>
          <Table>
            <TableCaption>
              {data.data.filter(
                (task) =>
                  moment(task.from).format("DD/MM/YYYY") ===
                  moment(selectedDate).format("DD/MM/YYYY"),
              ).length > 0
                ? `${employee.name} Tasks on ${moment(selectedDate).format(
                    "DD/MM/YYYY",
                  )}`
                : `no Tasks assgined to ${employee.name} on ${moment(
                    selectedDate,
                  ).format("DD/MM/YYYY")}`}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Left Time</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data
                .filter(
                  (task) =>
                    moment(task.from).format("DD/MM/YYYY") ===
                    moment(selectedDate).format("DD/MM/YYYY"),
                )
                .map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    employee={employee}
                    selectedDate={selectedDate}
                    remainingHours={remainingHours}
                  />
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  return null;
};

const TaskRow = ({
  task,
  employee,
  selectedDate,
  remainingHours,
}: {
  task: Task;
  employee: Employee;
  selectedDate: Date;
  remainingHours: number;
}) => {
  const [deleteTask] = useDeleteTaskMutation();
  const calculateTaskDuration = (task: Task) => {
    const start = moment(task.from);
    const end = moment(task.to);
    return moment.duration(end.diff(start)).asHours();
  };

  return (
    <TableRow key={task.id}>
      <TableCell>
        <div className="font-medium">{task.description}</div>
      </TableCell>
      <TableCell>
        <div className="font-medium">
          {moment(task.from).format("DD MMM, YYYY H:mm A")}
        </div>
      </TableCell>
      <TableCell>
        <div className="font-medium">
          {moment(task.to).format("DD MMM, YYYY H:mm A")}
        </div>
      </TableCell>
      <TableCell>
        <TaskTimer task={task} />
      </TableCell>
      <TableCell className="flex items-center justify-end gap-2">
        <TaskDialog
          edit={true}
          task={task}
          employee={employee}
          selectedDate={selectedDate}
          remainingHours={remainingHours + calculateTaskDuration(task)}
        />
        <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
          <Trash2 className="size-4 text-red-800" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

const TaskTimer = ({ task }: { task: Task }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = moment();
      const end = moment(task.to);
      const duration = moment.duration(end.diff(now));

      if (duration.asSeconds() <= 0) {
        setTimeLeft("TimeOut");
      } else {
        setTimeLeft(
          `${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`,
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [task]);

  return <span>{timeLeft}</span>;
};
