import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import type { ProductRes } from "../../types/product";

type Props = { mode: "create" | "edit" };

type Category = { id: number; name: string };

export default function AdminProductForm({ mode }: Props) {
  return (
    <div>AdminProductForm</div>
  )
}