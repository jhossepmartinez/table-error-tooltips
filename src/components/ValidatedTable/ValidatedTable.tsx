import { Alert, Table, Tooltip } from "antd"
import { ColumnProperty, EnrichedDataSource, IndexErrors, Validator } from "../types"
import { CloseCircleOutlined } from "@ant-design/icons";
import { useState } from "react";

export const ValidatedTable = ({validators, dataSource, columnProperties}: {validators: Validator[], dataSource: EnrichedDataSource[], columnProperties: ColumnProperty[]}) => {
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

    const indexErrors: IndexErrors = {}
    const columns = columnProperties.map((columnProp) => ({
        title: columnProp.name,
        dataIndex: columnProp.name,
        render: (
            text: string, record: EnrichedDataSource, relativeIndex: number
        ) => {
            const errors = record.errors && record.errors[columnProp.name]?.join("\n") || null;
            const absoluteIndex = (pagination.current - 1) * pagination.pageSize + relativeIndex;
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

        return data.map(record => {
            const errors: Record<string, string[]> = {};
            requiredFields.map((field) => {
                if (!record[field]) {
                    if (!errors[field]) errors[field] = [];
                    errors[field].push("This field is required");
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

    const validatedRequiredFieldsData = validateRequiredFields(dataSource)
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

    const handleTableChange = (pagination) => {
        setPagination({
            current: pagination.current,
            pageSize: pagination.pageSize,
        });
    };

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
