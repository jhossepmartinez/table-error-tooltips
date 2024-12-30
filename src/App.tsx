// import { Table, Tooltip } from 'antd';
import './App.css';
// import { CloseCircleOutlined } from '@ant-design/icons';
import { ValidatedTable } from './components/ValidatedTable/ValidatedTable';
import tempData from "./temp.json"
import {  Validator } from './components/types';

// type DataSource = Record<string, string | Record<string, string []>>
//
// type EnrichedDataSource = DataSource & {
//     errors?: Record<string, string[]>;
// };
//
// type Validator = (data: EnrichedDataSource[]) => EnrichedDataSource[];

const validateDuplicatedNameAge: Validator = (data, indexErrors) => {
    const seen = new Map<string, number>(); // Use a map to track the first occurrence index
    const updatedData = [...data]; // Create a mutable copy of the input array

    return data.map((record, index) => {
        const errors: Record<string, string[]> = {};
        const key = `${record.name}-${record.age}`;

        if (seen.has(key)) {
            const firstIndex = seen.get(key)!;
            if (!indexErrors[index]) indexErrors[index] = {}
            indexErrors[index]["name"] = []
            indexErrors[index]["name"].push("Duplicated record")
            if (!indexErrors[firstIndex]) indexErrors[firstIndex] = {}
            indexErrors[firstIndex]["name"] = []
            indexErrors[firstIndex]["name"].push("Duplicated record")
            indexErrors[index]["age"] = []
            indexErrors[index]["age"].push("Duplicated record")
            indexErrors[firstIndex]["age"] = []
            indexErrors[firstIndex]["age"].push("Duplicated record")

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
        return updatedData[index] = {
            ...record,
            errors: { ...record.errors, ...errors }
        };
    });
};

// Validator for Jhossep's age
const validateJhossepAgeErrors: Validator = (data, indexErrors) => {
    return data.map((record, index) => {
        const errors: Record<string, string[]> = { ...record.errors };

        if (record.name === 'Jhossep' && record.age !== '22') {
            if (!errors.name) errors.name = [];
            if (!errors.age) errors.age = [];
            errors.name.push("Jhossep needs to be 22");
            errors.age.push("Jhossep needs to be 22");

            if (!indexErrors[index]) indexErrors[index] = {}
            if (!indexErrors[index]["name"]) indexErrors[index]["name"] = []
            indexErrors[index]["name"].push("Jhossep needs to be 22")
            if (!indexErrors[index]["age"]) indexErrors[index]["age"] = []
            indexErrors[index]["age"].push("Jhossep needs to be 22")
        }

        return {
            ...record,
            errors
        };
    });
};

// Validator for name capitalization
const validateNameCapitalization: Validator = (data, indexErrors) => {
    return data.map((record, index) => {
        const errors: Record<string, string[]> = { ...record.errors };

        if (record.name && typeof record.name === "string" && record.name[0] !== record.name[0].toUpperCase()) {
            if (!errors.name) errors.name = [];
            errors.name.push("Name needs to be Capitalized");
            if (!indexErrors[index]) indexErrors[index] = {}
            if (!indexErrors[index]["name"]) indexErrors[index]["name"] = []
            indexErrors[index]["name"].push("Name needs to be Capitalized")
        }

        return {
            ...record,
            errors
        };
    });
};

function App() {
    const columnProperties = [
        {
            name: "name",
            isRequired: true,
        },
        {
            name: "age",
            isRequired: true,
        },
        {
            name: "address",
            isRequired: false,
        }
    ]

    const dataSource = tempData

    return (
        <ValidatedTable dataSource={dataSource} validators={[validateDuplicatedNameAge, validateJhossepAgeErrors, validateNameCapitalization]} columnProperties={columnProperties} />
    );
}

export default App;

