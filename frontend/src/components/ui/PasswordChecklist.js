import React from "react";
import { CheckCircle2, Circle } from "lucide-react";

export default function PasswordChecklist({ password = "" }) {
  const rules = [
    { id: "length", label: "8+ characters", test: (v) => v.length >= 8 },
    { id: "uppercase", label: "1 uppercase", test: (v) => /[A-Z]/.test(v) },
    { id: "number", label: "1 number", test: (v) => /[0-9]/.test(v) },
    { id: "special", label: "1 special char", test: (v) => /[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]/.test(v) },
  ];

  return (
    <div className="mt-4 rounded-2xl bg-gray-50/80 p-5 border border-gray-100">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
        Password Checklist
      </p>
      <div className="grid grid-cols-2 gap-y-3 gap-x-4">
        {rules.map((rule) => {
          const isMet = rule.test(password);
          return (
            <div key={rule.id} className="flex items-center space-x-2">
              {isMet ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
              <span
                className={`text-sm ${
                  isMet ? "text-emerald-600 font-medium" : "text-gray-500"
                }`}
              >
                {rule.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
