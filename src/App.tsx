import { useState } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { Employees } from "./features/employees/Employees";
import { Employee } from "./common.types";
import { Tasks } from "./features/tasks/Tasks";
import Header from "./components/header";

function App() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const onClose = () => {
    setSelectedEmployee(null);
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main>
        <Header />
        <section className="w-full px-3 py-8 md:py-10 space-y-3">
          {selectedEmployee ? (
            <Tasks onClose={onClose} employee={selectedEmployee} />
          ) : (
            <Employees setSelectedEmployee={setSelectedEmployee} />
          )}
        </section>
      </main>
    </ThemeProvider>
  );
}

export default App;
