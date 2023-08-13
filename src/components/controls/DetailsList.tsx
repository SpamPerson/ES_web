import { useMemo, useState } from 'react';
import { Stack, StackItem } from '../styled.components';
import { IColumn } from '../types';

interface PList {
   columns: IColumn[];
   items: any[];
}

export const DetailsList: React.FC<PList> = (props) => {
   // const [itemSize, setItemSize] = useState<number>(props.items.length);

   const list = useMemo(() => {
      return (
         <>
            {props.columns.map((value, index) => {
               let data;
               if(value.fieldName) {
                  // data = props.items.find(element => element.)
               }
               return <Stack></Stack>;
            })}
         </>
      );
   }, [props.items, props.columns]);

   return (
      <Stack style={{ padding: '10px 40px' }}>
         <Stack $horizontal style={{ border: '1px solid #e0e0e0', backgroundColor: '#e0e0e0' }}>
            {props.columns.map((value, index) => (
               <StackItem
                  $align="center"
                  key={value.key}
                  style={{ width: value.width, textAlign: 'center', borderLeft: index !== 0 ? '1px solid #e0e0e0' : undefined, padding: 5 }}
               >
                  {value.name}
               </StackItem>
            ))}
            {list}
         </Stack>
      </Stack>
   );
};
