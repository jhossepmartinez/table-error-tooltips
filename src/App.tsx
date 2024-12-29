import { Table, Tooltip } from 'antd';
import './App.css'
import { CloseCircleOutlined } from '@ant-design/icons';

type DataSource = Record<string, string | Record<string, string []>>

type EnrichedDataSource = DataSource & {
    errors?: Record<string, string []>; // Add errors field to the row type
};

// Validator for repeated name and age
// Validator for repeated name and age
const validateRepeatedNameAgeErrors = (data: EnrichedDataSource[]): EnrichedDataSource[] => {
    const seen = new Map<string, number>(); // Use a map to track the first occurrence index
    const updatedData = [...data]; // Create a mutable copy of the input array

    updatedData.forEach((record, index) => {
        const errors: Record<string, string[]> = {};
        const key = `${record.name}-${record.age}`;

        if (seen.has(key)) {
            const firstIndex = seen.get(key)!;

            // Update errors for the first occurrence
            const firstRecord = updatedData[firstIndex];
            const firstErrors: Record<string, string[]> = firstRecord.errors || {};
            if (!firstErrors.name) firstErrors.name = [];
            if (!firstErrors.name.includes("Duplicated record")) firstErrors.name.push("Duplicated record");
            if (!firstErrors.age) firstErrors.age = [];
            if (!firstErrors.age.includes("Duplicated record")) firstErrors.age.push("Duplicated record");

            updatedData[firstIndex] = {
                ...firstRecord,
                errors: { ...firstRecord.errors, ...firstErrors }
            };

            // Update errors for the current record
            errors.name = record.errors && record.errors.name || [];
            errors.age = record.errors && record.errors.age || [];
            if (!errors.name.includes("Duplicated record")) errors.name.push("Duplicated record");
            if (!errors.age.includes("Duplicated record")) errors.age.push("Duplicated record");
        } else {
            seen.set(key, index); // Record the index of the first occurrence
        }

        // Update the current record
        updatedData[index] = {
            ...record,
            errors: { ...record.errors, ...errors }
        };
    });

    return updatedData;
};

// Validator for Jhossep's age
const validateJhossepAgeErrors = (data: EnrichedDataSource[]): EnrichedDataSource[] => {
    return data.map(record => {
        const errors: Record<string, string[]> = { ...record.errors };

        if (record.name === 'Jhossep' && record.age !== '22') {
            if (!errors.name) errors.name = [];
            if (!errors.age) errors.age = [];
            errors.name.push("Jhossep needs to be 22");
            errors.age.push("Jhossep needs to be 22");
        }

        return {
            ...record,
            errors
        };
    });
};

// Validator for name capitalization
const validateNameCapitalization = (data: EnrichedDataSource[]): EnrichedDataSource[] => {
    return data.map(record => {
        const errors: Record<string, string[]> = { ...record.errors };

        if (record.name && typeof record.name === "string" && record.name[0] !== record.name[0].toUpperCase()) {
            if (!errors.name) errors.name = [];
            errors.name.push("Name needs to be Capitalized");
        }

        return {
            ...record,
            errors
        };
    });
};

// Combined validation
const validateData = (data: EnrichedDataSource[]): EnrichedDataSource[] => {
    let updatedData = validateRepeatedNameAgeErrors(data);
    updatedData = validateJhossepAgeErrors(updatedData);
    updatedData = validateNameCapitalization(updatedData);
    return updatedData;
};

function App() {
    const columnNames = ['name', 'age', 'address'];
    const columns = columnNames.map((name) => ({
        title: name,
        dataIndex: name,
        render: (text: string, record: EnrichedDataSource) => {
            const errors = record.errors && record.errors[name]?.join("\n") || null;
            return (
                <>
                    {text}
                    {" "}
                    { errors && (
                        <Tooltip title={<span style={{ whiteSpace: 'pre-wrap' }}>
                            {errors}
                        </span>}>
                            <CloseCircleOutlined style={{ color: "Red"}} />
                        </Tooltip>
                    ) }
                </>
            );
        }
    }));

    const dataSource = [
        {
            key: '1',
            name: 'Mike Wasowski',
            age: '32',
            address: '10 Downing Street',
        },
        {
            key: '2',
            name: 'Mike',
            age: '32',
            address: '10 Downing Street',
        },
        {
            key: '3',
            name: 'mike',
            age: '32',
            address: '10 Downing Street',
        },
        {
            key: '4',
            name: 'mike',
            age: '10',
            address: '123 Elm Street',
        },
        {
            key: '5',
            name: 'Jhossep',
            age: '22',
            address: '456 Oak Avenue',
        },
        {
            key: '6',
            name: 'Jhossep',
            age: '30',
            address: '789 Pine Road',
        },
        {
            key: '7',
            name: 'Ricardo',
            age: '10',
            address: '789 Pine Road',
        },
        {
            key: '8',
            name: 'Mauricio',
            age: '78',
            address: '789 Pine Road',
        },
        {
            key: '9',
            name: 'sanwich',
            age: '90',
            address: '789 Pine Road',
        },
        {
            key: '10',
            name: 'Aperitivo',
            age: '90',
            address: '789 Pine Road',
        },
        {
            key: '11',
            name: 'Openhauser',
            age: '22',
            address: '789 Pine Road',
        },
        {
            key: '12',
            name: 'sanwich',
            age: '90',
            address: '789 Pine Road',
        },
    ];

    const updatedSourceData = validateData(dataSource);
    console.log("updatedSourceData:", updatedSourceData);

    return (
        <div> 
            <Table columns={columns} dataSource={updatedSourceData}></Table>
        </div>
    );
}

export default App;

