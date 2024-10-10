export interface Task {
  id: string;
  description: string;
  isCompleted: boolean;
  from: Date;
  to: Date;
}

export interface ITask {
  description: string;
  isCompleted: boolean;
  from: Date;
  to: Date;
}

export interface IEmployee {
  name: string;
}

export interface Employee {
  id: string;
  name: string;
}

export interface EmployeeApiResponse {
  code: number;
  message: string;
  data: Employee[];
}

export interface TaskApiResponse {
  code: number;
  message: string;
  data: Task[];
}
