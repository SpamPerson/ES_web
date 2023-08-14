import { useEffect, useMemo, useState } from 'react';
import { Stack, StackItem, TextField } from '../styled.components';
import { EditType, IColumn, Items } from '../types';

interface PDetailsList {
   columns: IColumn[];
   items: Items;
   isAddRow?: boolean;
   isCheckBox: boolean;
   setIsCloseAddRow?: () => void;
   selection?: (items: any) => void;
}

interface IDetailsListUpdateContent {
   rowNum: number;
   key: string;
}

export const DetailsList: React.FC<PDetailsList> = (props) => {
   const [columns, setColumns] = useState<IColumn[]>([]);
   const [items, setItems] = useState<Items>([]);
   const [checkItemIndexs, setCheckItemIndexs] = useState<number[]>([]);
   const [modifiedContent, setModifiedContent] = useState<IDetailsListUpdateContent>();

   useEffect(() => {
      let newColumns: IColumn[] = [];
      let newItems: Items = [];
      if (props.isCheckBox) {
         newColumns.push({ key: 'checkBox', name: '체크', width: '5%' });
      }
      newItems.push(...props.items);
      newColumns.push(...props.columns);
      setColumns(newColumns);
      setItems(newItems);
   }, [props]);

   const list = useMemo(() => {
      const datas: any[] = [];
      const fieldWidths: any[] = [];

      columns.forEach((element) => {
         fieldWidths.push(element.width);
      });

      for (let i = 0; i < items.length; ++i) {
         let data: any = {};
         for (let j = 0; j < columns.length; ++j) {
            let columnFieldName = columns[j].fieldName;
            if (columnFieldName) {
               if (columnFieldName in items[i]) {
                  data[columnFieldName] = items[i][columnFieldName];
               } else {
                  data[columns[j].key] = '';
               }
            } else {
               data[columns[j].key] = '';
            }
         }
         datas.push(data);
      }

      return (
         <Stack style={{ width: '100%' }}>
            {datas.map((data, i) => {
               const objectKeys = Object.keys(data);
               return (
                  <Stack key={`${i}_row`} $horizontal style={{}}>
                     {objectKeys.map((key, j) => {
                        if (key === 'checkBox') {
                           return (
                              <StackItem
                                 key={key}
                                 style={{ borderBottom: '1px solid #e0e0e0', textAlign: 'center', width: fieldWidths[j], padding: 5 }}
                              >
                                 <input
                                    type="checkbox"
                                    checked={checkItemIndexs.findIndex((element) => element === i) > -1}
                                    onChange={() => onChangeCheckItems(i)}
                                 />
                              </StackItem>
                           );
                        } else {
                           return (
                              <Stack
                                 $verticalAlign="center"
                                 $horizontalAlign="center"
                                 key={key}
                                 style={{ borderBottom: '1px solid #e0e0e0', textAlign: 'center', width: fieldWidths[j], padding: 5 }}
                                 onDoubleClick={columns[j].editType ? () => onDoubleClick(i, key!) : undefined}
                              >
                                 {modifiedContent?.rowNum === i && modifiedContent.key === key ? (
                                    <>
                                       {' '}
                                       {columns[j].editType !== EditType.Choice ? (
                                          <TextField type="" style={{ height: '100%' }} />
                                       ) : (
                                          <select defaultValue={data[key]}>
                                             <option value={"Y"}>Y</option>
                                             <option value={"N"}>N</option>
                                          </select>
                                       )}
                                    </>
                                 ) : (
                                    data[key]
                                 )}
                              </Stack>
                           );
                        }
                     })}
                  </Stack>
               );
            })}
         </Stack>
      );
   }, [columns, items, checkItemIndexs, modifiedContent]); // eslint-disable-line react-hooks/exhaustive-deps

   const onChangeCheckItems = (index: number) => {
      let newCheckIndexs: number[] = [...checkItemIndexs];
      if (newCheckIndexs.findIndex((element) => element === index) > -1) {
         newCheckIndexs = newCheckIndexs.filter((element) => element !== index);
      } else {
         newCheckIndexs.push(index);
      }
      setCheckItemIndexs(newCheckIndexs);
      props.selection!(items[index]);
   };

   const onDoubleClick = (rowNum: number, key: string) => {
      setModifiedContent({ rowNum: rowNum, key: key });
   };

   return (
      <Stack style={{ padding: '10px 40px' }}>
         <Stack $horizontal style={{ border: '1px solid #e0e0e0', backgroundColor: '#e0e0e0' }}>
            {columns.map((value, index) => (
               <StackItem
                  $align="center"
                  key={value.key}
                  style={{
                     width: value.width,
                     textAlign: 'center',
                     fontWeight: 'bold',
                     borderLeft: index !== 0 ? '1px solid #e0e0e0' : undefined,
                     padding: 5,
                  }}
               >
                  {value.name}
               </StackItem>
            ))}
         </Stack>
         {items.length > 0 ? list : <Stack>데이터가 없습니다.</Stack>}
      </Stack>
   );
};
