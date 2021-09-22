import { EmployeeOrgApp, Employee } from './employee';

const ceo: Employee = {
    uniqueId: 1,
    name: 'Mark Zuckerberg',
    subordinates: [
        {
            uniqueId: 2,
            name: 'Sarah Donald',
            subordinates: [
                {
                    uniqueId: 3,
                    name: 'Cassandra Reynolds',
                    subordinates: [
                        {
                            uniqueId: 4,
                            name: 'Mary Blue',
                            subordinates: []
                        },
                        {
                            uniqueId: 5,
                            name: 'Bob Saget',
                            subordinates: [
                                {
                                    uniqueId: 6,
                                    name: 'Tina Teff',
                                    subordinates: []
                                },
                                {
                                    uniqueId: 7,
                                    name: 'Will Turner',
                                    subordinates: []
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            uniqueId: 8,
            name: 'Tyler Simpson',
            subordinates: [
                {
                    uniqueId: 9,
                    name: 'Harry Tobs',
                    subordinates: [
                        {
                            uniqueId: 10,
                            name: 'Thomas Brown',
                            subordinates: []
                        },
                    ]
                },
                {
                    uniqueId: 11,
                    name: 'George Carrey',
                    subordinates: []
                },
                {
                    uniqueId: 12,
                    name: 'Gary Style',
                    subordinates: []
                },
            ]
        },
        {
            uniqueId: 13,
            name: 'Bruce Willis',
            subordinates: []
        },
        {
            uniqueId: 15,
            name: 'Georgina Flang',
            subordinates: [
                {
                    uniqueId: 16,
                    name: 'Sophie Turne',
                    subordinates: []
                },
            ]
        },
    ]
}

const app = new EmployeeOrgApp(ceo);
console.log("Initial structure: ", JSON.stringify(app.ceo));
app.move(9, 1)
console.log("Structure after move: ", JSON.stringify(app.ceo));
app.undo();
console.log("Structure after undo: ", JSON.stringify(app.ceo));
app.redo()
console.log("Structure after redo: ", JSON.stringify(app.ceo));