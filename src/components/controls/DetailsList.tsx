import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Stack, TextField } from '../styled.components';
import { EditType, IColumn, IDetailsListUpdateContent, Items } from '../types';

interface PDetailsList {
   columns: IColumn[];
   items: Items;
   isAddRow?: boolean;
   isCheckBox: boolean;
   isIndex?: boolean;
   setIsCloseAddRow?: () => void;
   selection?: (items: any) => void;
   onChangeValue?: (contentInfo: IDetailsListUpdateContent, chageValue: string) => void;
}

export const DetailsList: React.FC<PDetailsList> = (props) => {
   const [columns, setColumns] = useState<IColumn[]>([]);
   const [items, setItems] = useState<Items>([]);
   const [checkItemIndexs, setCheckItemIndexs] = useState<number[]>([]);
   const [modifiedContent, setModifiedContent] = useState<IDetailsListUpdateContent>();
   const [changeTextField, setChangeTextField] = useState<string>('');

   useEffect(() => {
      let newColumns: IColumn[] = [];
      let newItems: Items = [];
      if (props.isCheckBox) {
         newColumns.push({ key: 'checkBox', name: '', width: '5%' });
      }
      if (props.isIndex) {
         newColumns.push({ key: 'index', name: 'No', width: '5%' });
      }

      newItems.push(...props.items);
      newColumns.push(...props.columns);
      setColumns(newColumns);
      setItems(newItems);
   }, [props]);

   const onBlurChangeTextField = (value: string) => {
      props.onChangeValue!(modifiedContent!, value);
      setModifiedContent(undefined);
   };

   const onkeydownChangeTextField = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.code === 'Enter') onBlurChangeTextField(event.currentTarget.value);
   };

   const onBlurChangeSelectBox = (value: string) => {
      props.onChangeValue!(modifiedContent!, value);
      setModifiedContent(undefined);
   };

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
                              <Stack
                                 key={key}
                                 $verticalAlign="center"
                                 $horizontalAlign="center"
                                 style={{ borderBottom: '1px solid #e0e0e0', textAlign: 'center', width: fieldWidths[j], padding: 5, cursor:'pointer' }}
                              >
                                 <input
                                    type="checkbox"
                                    checked={checkItemIndexs.findIndex((element) => element === i) > -1}
                                    onChange={() => onChangeCheckItems(i)}
                                 />
                              </Stack>
                           );
                        } else if (key === 'index') {
                           return (
                              <Stack
                                 key={key}
                                 $verticalAlign="center"
                                 $horizontalAlign="center"
                                 style={{ borderBottom: '1px solid #e0e0e0', textAlign: 'center', width: fieldWidths[j], padding: 5, cursor:'pointer' }}
                              >
                                 {i + 1}
                              </Stack>
                           );
                        } else {
                           return (
                              <Stack
                                 key={key}
                                 $verticalAlign="center"
                                 $horizontalAlign="center"
                                 style={{ borderBottom: '1px solid #e0e0e0', textAlign: 'center', width: fieldWidths[j], padding: 5, cursor:'pointer' }}
                                 onDoubleClick={columns[j].editType ? () => onDoubleClick(i, key!, data[key]) : undefined}
                              >
                                 {modifiedContent?.rowNum === i && modifiedContent.columnName === key ? (
                                    <>
                                       {columns[j].editType !== EditType.Choice ? (
                                          <TextField
                                             defaultValue={changeTextField}
                                             style={{ height: '100%' }}
                                             onBlur={(event: ChangeEvent<HTMLInputElement>) =>
                                                onBlurChangeTextField(event.currentTarget.value)
                                             }
                                             onKeyDown={onkeydownChangeTextField}
                                             autoFocus
                                          />
                                       ) : (
                                          <select
                                             defaultValue={data[key]}
                                             onBlur={(event: ChangeEvent<HTMLSelectElement>) =>
                                                onBlurChangeSelectBox(event.currentTarget.value)
                                             }
                                             onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                                                onBlurChangeSelectBox(event.currentTarget.value)
                                             }
                                          >
                                             <option value={'Y'}>Y</option>
                                             <option value={'N'}>N</option>
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

   const onDoubleClick = (rowNum: number, key: string, value: string) => {
      setChangeTextField(value);
      setModifiedContent({ rowNum: rowNum, columnName: key });
   };

   return (
      <Stack style={{ padding: '10px 40px' }}>
         <Stack $horizontal style={{ border: '1px solid #e0e0e0', backgroundColor: '#e0e0e0', userSelect: 'none' }}>
            {columns.map((value, index) => (
               <Stack
                  $verticalAlign="center"
                  key={value.key}
                  style={{
                     width: value.width,
                     textAlign: 'center',
                     fontWeight: 'bold',
                     padding: 5,
                  }}
               >
                  {value.name}
               </Stack>
            ))}
         </Stack>
         {items.length > 0 && list}
      </Stack>
   );
};
