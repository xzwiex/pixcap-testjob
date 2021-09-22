export interface Employee {
    uniqueId: number;
    name: string;
    subordinates: Employee[];
}

interface IEmployeeOrgApp {
    ceo: Employee;
    /** 
    * Moves the employee with employeeID (uniqueId) under a supervisor (another employee) that has supervisorID (uniqueId). 
    * E.g. move Bob (employeeID) to be subordinate of Georgina (supervisorID). * @param employeeID 
    * @param supervisorID 
    */
    move(employeeID: number, supervisorID: number): void;
    /** 
    * Undo last move action 
    */
    undo(): void;
    /** 
    * Redo last undone action 
    */
    redo(): void;
}

interface MoveAction {
    employeeID: number;
    fromSupervisorId?: number;
    toSupervisorID?: number;
}

interface MoveActions {
    forward: MoveAction[];
    backward: MoveAction[];
}

interface EmployeeWithSupervisor extends Employee {
    supervisorId?: number;
    subordinates: EmployeeWithSupervisor[];
}

export class EmployeeOrgApp implements IEmployeeOrgApp {
    private byId: { [id: number]: EmployeeWithSupervisor } = {}
    private actions: MoveActions[] = [];
    private actionIdx = 0;

    constructor(public ceo: Employee) {
        this.mapById(ceo);
    }

    move(employeeID: number, supervisorID: number): void {

        const employee = this.byId[employeeID];

        if (!employee) {
            throw new Error(`Employee with id ${employeeID} not found!`);
        }

        if (!employee.supervisorId) {
            throw new Error(`Cannot move ceo`);
        }
        const newSupervisor = this.byId[supervisorID];
        const prevSupervisor = this.byId[employee.supervisorId];


        if (!newSupervisor) {
            throw new Error(`New supervisor with id ${supervisorID} not found!`);
        }
        if (!prevSupervisor) {
            throw new Error(`Supervisor with id ${employee.supervisorId} not found!`);
        }

        prevSupervisor.subordinates = prevSupervisor.subordinates.filter(_ => _ != employee);
        newSupervisor.subordinates.push(employee);


        // Save basic forward/backward action
        const action: MoveActions = {
            forward: [
                { employeeID, fromSupervisorId: employee.supervisorId, toSupervisorID: supervisorID }
            ],
            backward: [
                { employeeID, fromSupervisorId: supervisorID, toSupervisorID: employee.supervisorId }
            ]
        }

        // Move employee subs to employee previous supervisor
        employee.subordinates.forEach((sub) => {

            sub.supervisorId = employee.supervisorId;

            prevSupervisor?.subordinates.push(sub);

            // Add forward/backward actions
            action.backward.push({ employeeID: sub.uniqueId, fromSupervisorId: employee.supervisorId, toSupervisorID: employeeID })
            action.forward.push({ employeeID: sub.uniqueId, fromSupervisorId: employeeID, toSupervisorID: employee.supervisorId, })
        })

        // Clean employee subs, change supervisor
        employee.subordinates = [];
        employee.supervisorId = supervisorID;

        this.actions = this.actions.slice(0, this.actionIdx); // If we call "redo" and then "move"
        this.actions.push(action);
        this.actionIdx += 1;
    }

    undo(): void {
        if (this.actionIdx == 0) {
            throw new Error("No actions to redo");
        }
        this.actionIdx -= 1;
        const action = this.actions[this.actionIdx];
        this.applyActions(action.backward);
    }

    redo(): void {
        if (this.actionIdx > this.actions.length) {
            throw new Error("No actions to redo");
        }
        this.actionIdx += 1;
        const action = this.actions[this.actionIdx - 1];
        this.applyActions(action.forward);
    }

    private applyActions(actions: MoveAction[]) {
        actions.forEach((a) => {
            const employee = this.byId[a.employeeID];
            const fromSupervior = a.fromSupervisorId ? this.byId[a.fromSupervisorId] : undefined;
            const toSupervisor = a.toSupervisorID ? this.byId[a.toSupervisorID] : undefined;

            if (fromSupervior) {
                fromSupervior.subordinates = fromSupervior?.subordinates.filter(_ => _ != employee);
            }

            toSupervisor?.subordinates.push(employee);

            employee.supervisorId = a.toSupervisorID;
        });
    }


    private mapById(e: EmployeeWithSupervisor, parentId?: number) {
        if (this.byId[e.uniqueId]) {
            throw new Error(`Duplicate uniqueId: ${e.uniqueId}`)
        }
        e.supervisorId = parentId;
        this.byId[e.uniqueId] = e;

        e.subordinates.forEach(element => this.mapById(element, e.uniqueId));
    }

}