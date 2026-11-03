"use client";

import { useCallback, useEffect, useState } from "react";
import Stored_Proc_List from "./Stored_Proc_List";

export interface StoredProcManagerProps {
  spNames: string[];
  open: boolean;
  onClose: () => void;
}

const Stored_Proc_Manager = ({spNames, open, onClose}: StoredProcManagerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
 
  useEffect(() => {
    if (open) setCurrentIndex(0);
  }, [open]);
 
  const handleClose = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= spNames.length) {
      onClose();
    }
    else {
      setCurrentIndex(nextIndex);
    }
  }, [currentIndex, spNames.length, onClose]);
 
  if (!open || spNames.length === 0) {
    return null;
  }

  return (
    <Stored_Proc_List
      spName={spNames[currentIndex]}
      open={true}
      onClose={handleClose}
      progress={{ current: currentIndex + 1, total: spNames.length }}
    />
  )
};

export default Stored_Proc_Manager;