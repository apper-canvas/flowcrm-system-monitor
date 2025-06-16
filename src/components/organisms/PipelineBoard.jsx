import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import { leadService } from '@/services'

const PIPELINE_STAGES = [
  { id: 'New', label: 'New', color: 'bg-gray-100 text-gray-800' },
  { id: 'Qualified', label: 'Qualified', color: 'bg-blue-100 text-blue-800' },
  { id: 'Proposal', label: 'Proposal', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'Negotiation', label: 'Negotiation', color: 'bg-orange-100 text-orange-800' },
  { id: 'Closed Won', label: 'Closed Won', color: 'bg-green-100 text-green-800' },
  { id: 'Closed Lost', label: 'Closed Lost', color: 'bg-red-100 text-red-800' }
]

const PipelineBoard = () => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [draggedLead, setDraggedLead] = useState(null)

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    setLoading(true)
    try {
      const data = await leadService.getAll()
      setLeads(data)
    } catch (error) {
      toast.error('Failed to load leads')
    } finally {
      setLoading(false)
    }
  }

  const onDragStart = (start) => {
    const lead = leads.find(l => l.id === start.draggableId)
    setDraggedLead(lead)
  }

  const onDragEnd = async (result) => {
    setDraggedLead(null)
    
    if (!result.destination) return

    const { draggableId, destination } = result
    const newStage = destination.droppableId

    try {
      await leadService.updateStage(draggableId, newStage)
      
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.id === draggableId
            ? { ...lead, stage: newStage }
            : lead
        )
      )

      toast.success(`Lead moved to ${newStage}`)
    } catch (error) {
      toast.error('Failed to update lead stage')
    }
  }

  const getLeadsByStage = (stage) => {
    return leads.filter(lead => lead.stage === stage)
  }

  const LeadCard = ({ lead, index }) => (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className={`
            bg-white rounded-lg border border-gray-200 p-4 mb-3 shadow-sm
            hover:shadow-md transition-all duration-200 cursor-pointer
            ${snapshot.isDragging ? 'shadow-lg rotate-2' : ''}
          `}
        >
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium text-gray-900 truncate flex-1">
              {lead.customerName}
            </h4>
            <div className="flex items-center ml-2">
              <ApperIcon name="GripVertical" size={16} className="text-gray-400" />
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-2 truncate">{lead.company}</p>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold text-gray-900">
              ${lead.value.toLocaleString()}
            </span>
            <Badge variant="info" size="sm">
              {lead.probability}%
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{lead.assignedTo}</span>
            <span>{new Date(lead.lastActivity).toLocaleDateString()}</span>
          </div>
        </motion.div>
      )}
    </Draggable>
  )

  const StageColumn = ({ stage }) => {
    const stageLeads = getLeadsByStage(stage.id)
    const stageValue = stageLeads.reduce((sum, lead) => sum + lead.value, 0)

    return (
      <div className="flex-1 min-w-80 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h3 className="font-semibold text-gray-900 mr-2">{stage.label}</h3>
            <Badge variant="default" size="sm">{stageLeads.length}</Badge>
          </div>
          <div className="text-sm font-medium text-gray-600">
            ${stageValue.toLocaleString()}
          </div>
        </div>

        <Droppable droppableId={stage.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`
                min-h-[200px] transition-colors duration-200 rounded-lg
                ${snapshot.isDraggingOver ? 'bg-primary/5 border-2 border-primary border-dashed' : ''}
              `}
            >
              <AnimatePresence>
                {stageLeads.map((lead, index) => (
                  <LeadCard key={lead.id} lead={lead} index={index} />
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((stage) => (
          <div key={stage.id} className="flex-1 min-w-80 bg-gray-50 rounded-lg p-4 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-200 rounded w-24"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-10"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((stage) => (
          <StageColumn key={stage.id} stage={stage} />
        ))}
      </div>
    </DragDropContext>
  )
}

export default PipelineBoard