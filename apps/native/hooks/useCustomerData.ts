// hooks/useCustomerData.ts
import { useState, useCallback, useEffect } from "react";
import { useAction } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { useDispatch, useSelector } from "react-redux";
import { setCustomer } from "@/store/userSlice";
import { RootState } from "@/store";

/**
 * Хук, возвращающий данные кастомера из LemonSqueezy,
 * сохраняющиеcя в Redux. Можно вызвать refetch() для повторного запроса.
 */
export function useCustomerData() {
  const dispatch = useDispatch();
  const customerData = useSelector((state: RootState) => state.user.customer);
  const [loading, setLoading] = useState(false);

  // Convex Action для получения данных кастомера
  const getCustomerData = useAction(api.lemon.getCustomer.getCustomerData);

  // Функция для повторного запроса
  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCustomerData();
      // Сохраняем в Redux
      dispatch(setCustomer(data));
    } catch (err) {
      console.error("Error fetching customer data:", err);
    } finally {
      setLoading(false);
    }
  }, [getCustomerData, dispatch]);

  // При первом рендере загружаем данные
  useEffect(() => {
    refetch();
  }, [refetch]);

  return { loading, customerData, refetch };
}
