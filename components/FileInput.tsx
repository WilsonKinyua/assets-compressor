'use client';

interface FileInputProps {
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  labelClassName?: string;
  children: React.ReactNode;
}

export default function FileInput({ id, onChange, labelClassName, children }: FileInputProps) {
  return (
    <>
      <input
        type="file"
        id={id}
        multiple
        accept="image/*"
        onChange={onChange}
        className="sr-only peer"
      />
      <label htmlFor={id} className={labelClassName}>
        {children}
      </label>
    </>
  );
}
