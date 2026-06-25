import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// 按照标准规范，对全局 Hook 进行类型绑定绑定，杜绝在组件层直接调用原生 Hook
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();