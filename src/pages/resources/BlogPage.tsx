
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const BlogPage = () => {
  const posts = [
    {
      title: "5 maneras de hacer tus reuniones virtuales más productivas",
      excerpt: "Descubre cómo implementar estrategias efectivas para maximizar el tiempo y los resultados de tus reuniones virtuales...",
      author: "Ana García",
      date: "6 de mayo, 2025",
      category: "Productividad",
      image: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    },
    {
      title: "Cómo la IA está transformando la toma de decisiones en equipo",
      excerpt: "La inteligencia artificial no solo está automatizando tareas, sino que está cambiando fundamentalmente cómo se toman decisiones...",
      author: "Carlos Mendoza",
      date: "28 de abril, 2025",
      category: "Tecnología",
      image: "https://images.unsplash.com/photo-1488229297570-58520851e868?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80"
    },
    {
      title: "Estudio de caso: Cómo ACME Corp redujo en un 30% el tiempo de reuniones",
      excerpt: "ACME Corporation implementó una serie de cambios en su cultura de reuniones que resultaron en una mejora significativa...",
      author: "Laura Sánchez",
      date: "15 de abril, 2025",
      category: "Casos de Éxito",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80"
    },
    {
      title: "La guía definitiva para la asignación y seguimiento de tareas",
      excerpt: "Te mostramos las mejores estrategias para asignar tareas y hacer un seguimiento efectivo, sin importar el tamaño de tu equipo...",
      author: "Miguel Rodríguez",
      date: "8 de abril, 2025",
      category: "Gestión",
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80"
    },
    {
      title: "Equipos híbridos: Cómo mantener la colaboración efectiva",
      excerpt: "Con algunos miembros trabajando remotamente y otros en oficina, aquí te mostramos cómo mantener la cohesión y productividad...",
      author: "Patricia Alonso",
      date: "1 de abril, 2025",
      category: "Trabajo Híbrido",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    },
    {
      title: "Las 10 métricas más importantes para evaluar la eficacia de tus reuniones",
      excerpt: "No todos los indicadores son iguales. Descubre cuáles son los KPIs que realmente importan para medir el éxito de tus reuniones...",
      author: "David Ramírez",
      date: "25 de marzo, 2025",
      category: "Análisis",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    }
  ];

  const getCategoryColor = (category) => {
    switch (category) {
      case "Productividad": return "bg-green-100 text-green-800";
      case "Tecnología": return "bg-blue-100 text-blue-800";
      case "Casos de Éxito": return "bg-purple-100 text-purple-800";
      case "Gestión": return "bg-amber-100 text-amber-800";
      case "Trabajo Híbrido": return "bg-indigo-100 text-indigo-800";
      case "Análisis": return "bg-cyan-100 text-cyan-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <PageTemplate 
      title="Blog" 
      subtitle="Ideas, consejos y mejores prácticas para reuniones y colaboración efectiva"
      showCTA={false}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {posts.map((post, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="h-48 overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <Badge className={`${getCategoryColor(post.category)}`}>
                  {post.category}
                </Badge>
                <span className="text-sm text-gray-500">{post.date}</span>
              </div>
              <Link to="/auth" className="block">
                <h3 className="text-xl font-bold mb-2 hover:text-indigo-600 transition-colors">{post.title}</h3>
              </Link>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-indigo-200 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">{post.author}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageTemplate>
  );
};

export default BlogPage;
