// import React, { useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@@/ui/card";
// import { CardItemProps } from "@views/product/upsert";
// import {
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@@/ui/form";
// import { cn } from "@/lib/utils";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@@/ui/tooltip";
// import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
// import { Switch } from "@@/ui/switch";
// import { OtherOption } from "@views/product/components/category";
// import { Input } from "@@/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectLabel,
//   SelectSeparator,
//   SelectTrigger,
//   SelectValue,
// } from "@@/ui/select";
// import { Button } from "@@/ui/button";
// import { Separator } from "@@/ui/separator";
// import { SelectItemText } from "@radix-ui/react-select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@@/ui/table";
// import { useFieldArray } from "react-hook-form";
// import { Plus, Trash } from "lucide-react";
//
// const Collection = ({ form }: CardItemProps) => {
//   const isInCollection = form.watch("collection.isInCollection");
//   const {
//     control,
//     register,
//     formState: { errors },
//   } = form;
//   const { fields, insert, append, remove } = useFieldArray({
//     control,
//     name: "collection.items",
//   });
//   useEffect(() => {
//     if (isInCollection) {
//       insert(0, {
//         status: "Chung tình trạng",
//         quantity: 1,
//       });
//     }
//   }, [isInCollection]);
//
//   const addMoreStatus = async () => {
//     const isValid = await form.trigger("collection.items");
//     if (isValid) {
//       append({
//         status: "",
//         quantity: 1,
//       });
//     }
//   };
//
//   return (
//     <Card>
//       <CardHeader>
//         <FormField
//           control={form.control}
//           name="collection.isInCollection"
//           render={({ field }) => (
//             <FormItem>
//               <FormControl>
//                 <Switch
//                   checked={field.value}
//                   onCheckedChange={field.onChange}
//                 />
//               </FormControl>
//               <FormDescription>Thêm sản phẩm vào chung bộ</FormDescription>
//             </FormItem>
//           )}
//         />
//       </CardHeader>
//       <CardContent>
//         {isInCollection && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="grid gap-4">
//               <FormField
//                 control={form.control}
//                 name="collection.name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Tên bộ sản phẩm</FormLabel>
//                     <FormControl>
//                       <Input {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <Button
//                 variant="secondary"
//                 className="max-w-[150px]"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   addMoreStatus();
//                 }}
//               >
//                 <Plus />
//                 Thêm tình trạng
//               </Button>
//             </div>
//
//             <Card>
//               <CardContent>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead className="pl-4 ">Tình trạng</TableHead>
//                       <TableHead className="pl-4 w-[130px]">Số
// lượng</TableHead> <TableHead className="w-[100px]"></TableHead> </TableRow>
// </TableHeader> <TableBody> {fields.map((item, index) => ( <TableRow
// key={item.id}> <TableCell> <Input {...register(
// `collection.items.${index}.status` as const, { required: true, }, )}
// readOnly={index === 0} className={
// errors?.collection?.items?.[index]?.status ? "outline outline-rose-500" : ""
// } /> </TableCell> <TableCell> <Input type="number" {...register(
// `collection.items.${index}.quantity` as const, { valueAsNumber: true,
// required: true, min: 1, }, )} className={
// errors?.collection?.items?.[index]?.quantity ? "outline outline-rose-500" : "" } min={1} /> </TableCell> {index !== 0 && ( <TableCell> <Button variant="ghost" size="icon" onClick={() => remove(index)} > <Trash className="w-4 h-4" /> </Button> </TableCell> )} </TableRow> ))} </TableBody> </Table> </CardContent> </Card> </div> )} </CardContent> </Card> ); };  export default Collection;

import React from "react";

const Collection = () => {
  return <div>Feature not accept</div>;
};

export default Collection;
