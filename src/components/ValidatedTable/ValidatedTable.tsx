import { Table, Tooltip } from "antd"
import { EnrichedDataSource, Validator } from "../types"
import { CloseCircleOutlined } from "@ant-design/icons";

export const ValidatedTable = ({validators, dataSource, columnNames}: {validators: Validator[], dataSource: EnrichedDataSource[], columnNames: string[]}) => {
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

    const validateData = (data: EnrichedDataSource[]): EnrichedDataSource[] => {
        return validators.reduce((validatedData, validator) => validator(validatedData), data);
    };

    

    const validatedData = validateData(dataSource)

    return (
        <div>
            <Table dataSource={validatedData} columns={columns}></Table>
        </div>
    )
}
