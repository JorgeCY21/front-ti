import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateGoal,
  useGoalsByUser,
  useUpdateGoal,
  useDeleteGoal,
} from "../hooks/useGoals";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import { Pencil, Save, X, Trash2 } from "lucide-react";

function GoalsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [estimatedCost, setEstimatedCost] = useState("");
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editEstimatedCost, setEditEstimatedCost] = useState<number>(0);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();
  const { data: goals, isLoading, refetch } = useGoalsByUser(user?.id ?? "");

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = parseFloat(estimatedCost);
    if (isNaN(cost) || cost <= 0) {
      showToast("Costo inválido", "error");
      return;
    }

    createGoal.mutate(
      { user_id: user!.id, estimated_cost: cost },
      {
        onSuccess: () => {
          setEstimatedCost("");
          showToast("Meta creada correctamente", "success");
          refetch();
        },
        onError: (err: any) => {
          if (err.response?.status === 409) {
            showToast("Ya tienes una meta para este mes", "error");
          } else {
            showToast("Error al crear la meta", "error");
          }
        },
      }
    );
  };

  const startEditing = (goalId: string, estimated_cost: number) => {
    setEditingGoalId(goalId);
    setEditEstimatedCost(estimated_cost);
  };

  const handleUpdate = (goalId: string, month: string, year: number) => {
    updateGoal.mutate(
      {
        id: goalId,
        data: { month, year, estimated_cost: editEstimatedCost },
      },
      {
        onSuccess: () => {
          showToast("Meta actualizada correctamente", "success");
          setEditingGoalId(null);
          refetch();
        },
        onError: () => {
          showToast("Error al actualizar la meta", "error");
        },
      }
    );
  };

  const handleDelete = (goalId: string) => {
    deleteGoal.mutate(goalId, {
      onSuccess: () => {
        showToast("Meta eliminada correctamente", "success");
        refetch();
      },
      onError: () => {
        showToast("Error al eliminar la meta", "error");
      },
    });
  };

  if (!user) return <p className="text-center py-10">Cargando usuario...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <section className="max-w-2xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-[#005766] hover:text-[#00434f] transition-colors cursor-pointer select-none"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver
        </button>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-3xl font-bold mb-8 text-center text-[#00434f]">Metas de Consumo</h2>

          <div className="bg-[#f5f9fa] p-6 rounded-lg mb-8 border border-[#e1e8ea]">
            <h3 className="text-lg font-semibold mb-4 text-[#00434f]">Crear nueva meta</h3>
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">Costo estimado (S/)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">S/</span>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005766] focus:border-transparent"
                    placeholder="Ej: 70.50"
                    min={0}
                    step={0.01}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={createGoal.isPending}
                className="w-full bg-gradient-to-r from-[#005766] to-[#00434f] text-white py-3 rounded-lg hover:from-[#00434f] hover:to-[#00333d] transition-all shadow-md flex justify-center items-center cursor-pointer select-none"
              >
                {createGoal.isPending ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {createGoal.isPending ? "Creando..." : "Crear Meta"}
              </button>
            </form>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 text-[#00434f] border-b pb-2">Tus metas actuales</h3>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#005766]"></div>
              </div>
            ) : goals?.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No tienes metas creadas aún</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {goals?.map((goal) => (
                  <li key={goal.id} className="border border-gray-200 rounded-lg p-5 bg-white hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="text-lg font-semibold text-[#00434f]">{goal.month} {goal.year}</span>
                        </div>
                        {editingGoalId === goal.id ? (
                          <div className="mt-3 space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">S/.</span>
                                <input
                                  type="number"
                                  value={editEstimatedCost}
                                  onChange={(e) => setEditEstimatedCost(parseFloat(e.target.value))}
                                  className="pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm w-36 focus:outline-none focus:ring-2 focus:ring-[#005766] focus:border-transparent"
                                  min={0}
                                  step={0.01}
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdate(goal.id, goal.month, goal.year)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-[#005766] text-white text-sm rounded-md hover:bg-[#00434f] transition-colors cursor-pointer select-none"
                              >
                                <Save className="w-4 h-4" />
                                Guardar
                              </button>
                              <button
                                onClick={() => setEditingGoalId(null)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition-colors cursor-pointer select-none"
                              >
                                <X className="w-4 h-4" />
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2">
                            <p className="text-gray-700">
                              <span className="font-medium text-[#005766]">S/. {goal.estimated_cost.toFixed(2)}</span> ≈{" "}
                              <span className="font-medium">{goal.goal_kwh.toFixed(2)} kWh</span>
                            </p>
                          </div>
                        )}
                      </div>

                      {editingGoalId !== goal.id && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditing(goal.id, goal.estimated_cost)}
                            className="p-2 text-[#005766] hover:bg-[#f0f7f9] rounded-full transition-colors cursor-pointer select-none"
                            title="Editar"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(goal.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer select-none"
                            title="Eliminar"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default GoalsPage;