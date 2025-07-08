import { useState } from "react";
import { useCreateGoal, useGoalsByUser } from "../hooks/useGoals";
import { useAuth } from "../context/AuthContext";

function GoalsPage() {
  const { user } = useAuth();
  const [estimatedCost, setEstimatedCost] = useState("");

  // ✅ Si aún no se ha cargado el usuario
  if (!user) {
    return <p className="text-center py-10">Cargando usuario...</p>;
  }

  const createGoal = useCreateGoal();
  const { data: goals, isLoading, refetch } = useGoalsByUser(user.id); // user está asegurado

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = parseFloat(estimatedCost);
    if (isNaN(cost) || cost <= 0) return alert("Costo inválido");

    createGoal.mutate(
      {
        user_id: user.id,
        estimated_cost: cost,
      },
      {
        onSuccess: () => {
          alert("Meta creada correctamente");
          setEstimatedCost("");
          refetch(); // refrescar lista
        },
        onError: (err: any) => {
          if (err.response?.status === 409) {
            alert("Ya tienes una meta para este mes.");
          } else {
            alert("Error al crear la meta.");
          }
        },
      }
    );
  };

  return (
    <section className="min-h-screen bg-[#f9fafb] py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center">Metas de Consumo</h2>

        <form onSubmit={handleSubmit} className="mb-8">
          <label className="block mb-2 text-sm text-gray-600">Costo estimado (S/)</label>
          <input
            type="number"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
            className="w-full border px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#005766]"
            placeholder="Ej: 70.50"
            min={0}
            step={0.01}
            required
          />
          <button
            type="submit"
            disabled={createGoal.isPending}
            className="w-full bg-[#005766] text-white py-2 rounded hover:bg-[#00434f]"
          >
            {createGoal.isPending ? "Creando..." : "Crear Meta"}
          </button>
        </form>

        <h3 className="text-lg font-medium mb-2">Tus metas actuales</h3>
        {isLoading ? (
          <p>Cargando metas...</p>
        ) : (
          <ul className="space-y-2">
            {goals?.map((goal) => (
              <li key={goal.id} className="border rounded p-3 text-sm text-gray-700">
                <strong>{goal.month} {goal.year}</strong> - S/{goal.estimated_cost.toFixed(2)} ≈ {goal.goal_kwh.toFixed(2)} kWh
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default GoalsPage;
