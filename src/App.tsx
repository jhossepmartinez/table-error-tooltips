import { Table, Tooltip } from 'antd';
import './App.css'
import { CloseCircleOutlined } from '@ant-design/icons';

type DataSource = Record<string, string | Record<string, string []>>

type EnrichedDataSource = DataSource & {
    errors?: Record<string, string []>; // Add errors field to the row type
};

const validateRepeatedNameAge = (data: EnrichedDataSource[]): EnrichedDataSource[] => {
    console.log("validateRecords2 data:", data);
    const seen = new Map<string, number>(); // Use a map to track the first occurrence index
    const updatedData = [...data]; // Create a mutable copy of the input array

    updatedData.forEach((record, index) => {
        const errors: Record<string, string[]> = {};
        const key = `${record.name}-${record.age}`;

        // Validator for Jhossep's age
        if (record.name === 'Jhossep' && record.age !== '22') {
            if (!errors.name) errors.name = [];
            if (!errors.age) errors.age = [];
            errors.name.push("Jhossep needs to be 22");
            errors.age.push("Jhossep needs to be 22");
        }

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

            )
        }

    }))




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
            name: 'Mike',
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
            age: '23',
            address: '456 Oak Avenue',
        },
        {
            key: '6',
            name: 'Jhossep',
            age: '22',
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
            name: 'Sanwich',
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
            name: 'Jhossep',
            age: '22',
            address: '789 Pine Road',
        },
        {
            key: '13',
            name: 'Jhossep',
            age: '23',
            address: '789 Pine Road',
        },
    ];

    const updatedSourceData = validateRepeatedNameAge(dataSource);
    console.log("updatedSourceData:", updatedSourceData);

    const updatedSourceData2 = validateRepeatedNameAge(updatedSourceData);
    console.log("updatedSourceData2:", updatedSourceData2);

    return (
        <div> 
            <Table columns={columns} dataSource={updatedSourceData}></Table>
        </div>
    )
}

export default App
