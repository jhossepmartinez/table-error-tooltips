import { Alert, Table, Tooltip } from "antd"
import { ColumnProperty, EnrichedDataSource, IndexErrors, Validator } from "../types"
import { CloseCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { TablePaginationConfig } from "antd";

export const ValidatedTable = ({validators, dataSource, columnProperties}: {validators: Validator[], dataSource: EnrichedDataSource[], columnProperties: ColumnProperty[]}) => {
    const [pagination, setPagination] = useState<TablePaginationConfig>({ current: 1, pageSize: 10 });

    const indexErrors: IndexErrors = {}
    const columns = columnProperties.map((columnProp) => ({
        title: columnProp.name,
        dataIndex: columnProp.name,
        render: (
            text: string, record: EnrichedDataSource, relativeIndex: number
        ) => {
            const errors = record.errors && record.errors[columnProp.name]?.join("\n") || null;
            const absoluteIndex = ((pagination.current || 1) - 1) * (pagination.pageSize || 10) + relativeIndex;
            const indexErrorMessages = indexErrors[absoluteIndex] && indexErrors[absoluteIndex][columnProp.name]?.join("\n") || null;
            return (
                <>
                    {text}
                    {" "}
                    { indexErrorMessages && (
                        <Tooltip title={<span style={{ whiteSpace: 'pre-wrap' }}>
                            {indexErrorMessages}
                        </span>}>
                            <CloseCircleOutlined style={{ color: "Red"}} />
                        </Tooltip>
                    ) }
                </>
            );
        }
    }));

    const validateRequiredFields: Validator = (data) => {
        const requiredFields = columnProperties.filter((columnProp) => columnProp.isRequired).map((columnProp) => columnProp.name);
        if (requiredFields.length === 0) return data 

        return data.map((record, index) => {
            const errors: Record<string, string[]> = {};
            requiredFields.map((field) => {
                if (!record[field]) {
                    if (!errors[field]) errors[field] = [];
                    errors[field].push("This field is required");
                    if (!indexErrors[index]) indexErrors[index] = {}
                    indexErrors[index][field] = []
                    indexErrors[index][field].push("This field is required")
                }
            })
            return {
                ...record,
                errors
            }
        })
    }

    const validateData = (data: EnrichedDataSource[]): EnrichedDataSource[] => {
        return validators.reduce((validatedData, validator) => validator(validatedData, indexErrors), data);
    };

    const validatedRequiredFieldsData = validateRequiredFields(dataSource, indexErrors)
    // console.log("validateRequiredFieldsData", validatedRequiredFieldsData)
    const validatedData = validateData(validatedRequiredFieldsData || dataSource)

    validatedData.sort((a, b) => Object.keys(b.errors || {}).length - Object.keys(a.errors || {}).length)

    // console.log("initialData", dataSource)

    // console.log("validatedData", validatedData)

    const dataWithoutErrors = validatedData.filter((record) => Object.keys(record.errors || {}).length === 0)

    const showDataHasErrorsAlert = dataWithoutErrors.length < dataSource.length

    // console.log("dataWithoutErrors", dataWithoutErrors)

    console.log("indexErrors.length", Object.keys(indexErrors).length)
    console.log("indexErrorsIndeces:", Object.keys(indexErrors))

    const errorIndices = Object.keys(indexErrors).map((index) => parseInt(index))
    console.log("errorIndices:", errorIndices)

    const errorRecords = dataSource.filter((_, index) => errorIndices.includes(index));

    // Find a record that is NOT in errorIndices
    const nonErrorRecord = dataSource.filter((_, index) => !errorIndices.includes(index));

    console.log("errorRecords", errorRecords)
    console.log("nonErrorRecord", nonErrorRecord)

    const reorderedDataSource: EnrichedDataSource[] = []

    errorRecords.map((record) => reorderedDataSource.push(record))
    nonErrorRecord.map((record) => reorderedDataSource.push(record))

    console.log("reorderedDataSource", reorderedDataSource)
    



    const handleTableChange = (pagination: TablePaginationConfig) => {
        setPagination({
            current: pagination.current,
            pageSize: pagination.pageSize,
        });
    };


    console.log("indexErrors:", indexErrors)


    return (
        <div>
            { showDataHasErrorsAlert && (
                <Alert type="error" showIcon message="Some records on your file have errors" description="You can continue the creation of the records but the marked ones will be skipped"></Alert>
            )}
            <Table dataSource={dataSource} columns={columns} pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
            }}></Table>
        </div>
    )
}
