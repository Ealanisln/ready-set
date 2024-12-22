"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BakeGoodsDeliveryForm,
  FlowerDeliveryForm,
  SpecialtyDeliveryForm,
  FoodDeliveryForm
} from './DeliveryForms.old'; // Assuming your forms are in this file

const DeliveryFormContainer = () => {
  const [selectedForm, setSelectedForm] = useState('bakeGoods');

  const renderForm = () => {
    switch (selectedForm) {
      case 'bakeGoods':
        return <BakeGoodsDeliveryForm />;
      case 'flower':
        return <FlowerDeliveryForm />;
      case 'specialty':
        return <SpecialtyDeliveryForm />;
      case 'food':
        return <FoodDeliveryForm />;
      default:
        return <BakeGoodsDeliveryForm />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardContent className="pt-6">
          <Select value={selectedForm} onValueChange={setSelectedForm}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select delivery type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="bakeGoods">Bake Goods Delivery</SelectItem>
                <SelectItem value="flower">Flower Delivery</SelectItem>
                <SelectItem value="specialty">Specialty Delivery</SelectItem>
                <SelectItem value="food">Food Delivery</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {renderForm()}
    </div>
  );
};

export default DeliveryFormContainer;