import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import ImagePlaceholder from '../../../../components/ImagePlaceholder'
import { toSmallImage } from '../../../../utils/imageVariant'
import {
  buildTree,
  findDroppedIds,
  getDropColumns,
  getLeafColumns,
  getNodeWidth,
  getSurnameFontSize,
  isLeafGroup,
  splitName,
} from '../../orgTree'
import MemberModal from '../MemberModal'
import './org_chart.css'

const VERTICAL_SCALE_LIMIT = 0.62

function OrgCard({ member, isRoot, hasFixedSurnameSize, onOpen }) {
  const [firstNames, surname] = splitName(member.name)
  const officialTitle = member.officialTitle?.trim()

  return (
    <button
      type="button"
      className={`org_card${isRoot ? ' root' : ''}`}
      aria-haspopup="dialog"
      aria-label={`${member.name}${member.role ? `, ${member.role}` : ''} — ayrıntıları aç`}
      onClick={() => onOpen(member)}
    >
      <span className="org_photo">
        {member.photo ? (
          <img src={toSmallImage(member.photo)} alt="" width={64} height={64} loading="lazy" decoding="async" />
        ) : (
          <ImagePlaceholder />
        )}
      </span>
      <span className="org_info">
        <strong className="org_name">
          <span className="n1">{firstNames}</span>
          {surname && (
            <span className="n2" style={hasFixedSurnameSize ? undefined : { fontSize: getSurnameFontSize(surname) }}>
              {surname}
            </span>
          )}
        </strong>
        {member.role && <span className="org_role">{member.role}</span>}
        {officialTitle && officialTitle !== member.role && <em className="org_unvan">{officialTitle}</em>}
      </span>
    </button>
  )
}

function OrgNode({ node, depth, controls }) {
  const { isCollapsible, expandedIds, droppedIds, isVertical, onToggle, onOpen } = controls
  const hasChildren = node.children.length > 0
  const isExpanded = !isCollapsible || expandedIds.has(node.id)
  const isDropped = !isCollapsible && droppedIds.has(node.id)
  const droppedChild = isCollapsible ? undefined : node.children.find((child) => droppedIds.has(child.id))
  const isRoot = depth === 0

  const card = <OrgCard member={node} isRoot={isRoot} hasFixedSurnameSize={isRoot && !isVertical} onOpen={onOpen} />

  return (
    <li className={isDropped ? 'org_dropped' : undefined}>
      {isCollapsible && hasChildren ? (
        <div className="org_row">
          {card}
          <button
            type="button"
            className={`org_toggle${isExpanded ? ' open' : ''}`}
            aria-expanded={isExpanded}
            aria-label={`${node.name} altındaki ${node.children.length} kişiyi ${isExpanded ? 'gizle' : 'göster'}`}
            onClick={() => onToggle(node.id)}
          >
            <span className="cnt">{node.children.length}</span>
            <ChevronDown size={18} aria-hidden="true" />
          </button>
        </div>
      ) : (
        card
      )}
      {isDropped && <span className="org_stem" aria-hidden="true" />}
      {hasChildren && isExpanded && !isDropped && (
        isLeafGroup(node) ? (
          <div className="org_leaves" style={{ '--cols': getLeafColumns(node) }}>
            {node.children.map((child) => (
              <OrgCard key={child.id} member={child} isRoot={false} onOpen={onOpen} />
            ))}
          </div>
        ) : (
          <>
            <ul>
              {node.children.map((child) => (
                <OrgNode key={child.id} node={child} depth={depth + 1} controls={controls} />
              ))}
            </ul>
            {droppedChild && (
              <div className="org_leaves drop" style={{ '--cols': getDropColumns(droppedChild.children.length) }}>
                <div className="org_leaves_label">
                  {droppedChild.children[0]?.section ? `${droppedChild.children[0].section} Üyeleri` : 'Üyeler'}
                </div>
                {droppedChild.children.map((child) => (
                  <OrgCard key={child.id} member={child} isRoot={false} hasFixedSurnameSize onOpen={onOpen} />
                ))}
              </div>
            )}
          </>
        )
      )}
    </li>
  )
}

function OrgChart({ members }) {
  const roots = useMemo(() => buildTree(members), [members])
  const droppedIds = useMemo(() => findDroppedIds(roots), [roots])
  const scrollRef = useRef(null)
  const listRef = useRef(null)
  const [availableWidth, setAvailableWidth] = useState(0)
  const [measuredWidth, setMeasuredWidth] = useState(0)
  const [measuredHeight, setMeasuredHeight] = useState(0)
  const [selectedMember, setSelectedMember] = useState(null)
  const [expandedIds, setExpandedIds] = useState(() => new Set(roots.map((root) => root.id)))

  const closeMember = useCallback(() => setSelectedMember(null), [])
  const toggleNode = useCallback((id) => {
    setExpandedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  useLayoutEffect(() => {
    const scrollElement = scrollRef.current
    const listElement = listRef.current
    if (!scrollElement || !listElement) return undefined
    const measure = () => {
      setAvailableWidth(scrollElement.clientWidth)
      if (!scrollElement.classList.contains('vertical')) {
        setMeasuredWidth(listElement.offsetWidth)
        setMeasuredHeight(listElement.offsetHeight)
      }
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(scrollElement)
    observer.observe(listElement)
    return () => observer.disconnect()
  }, [members])

  const naturalWidth = Math.max(
    roots.reduce((sum, root) => sum + getNodeWidth(root, droppedIds), 0),
    measuredWidth,
  )
  const scale = availableWidth > 0 ? Math.min(1, (availableWidth - 16) / naturalWidth) : 1
  const isVertical = scale < VERTICAL_SCALE_LIMIT
  const isFitted = !isVertical && scale < 1

  const parentIds = []
  const collectParents = (node) => {
    if (!node.children.length) return
    parentIds.push(node.id)
    node.children.forEach(collectParents)
  }
  roots.forEach(collectParents)
  const isAllExpanded = parentIds.length > 0 && parentIds.every((id) => expandedIds.has(id))

  const controls = {
    isCollapsible: isVertical,
    isVertical,
    expandedIds,
    droppedIds,
    onToggle: toggleNode,
    onOpen: setSelectedMember,
  }

  return (
    <div
      ref={scrollRef}
      className={['org_scroll', isVertical ? 'vertical' : '', isFitted ? 'fit' : ''].filter(Boolean).join(' ')}
      style={isFitted && measuredHeight > 0 ? { height: Math.ceil(measuredHeight * scale) + 24 } : undefined}
    >
      {isVertical && parentIds.length > roots.length && (
        <button
          type="button"
          className="org_expand_all"
          onClick={() => setExpandedIds(isAllExpanded ? new Set(roots.map((root) => root.id)) : new Set(parentIds))}
        >
          {isAllExpanded ? 'Tümünü daralt' : 'Tümünü aç'}
        </button>
      )}
      <div className="org" style={isFitted ? { transform: `translateX(-50%) scale(${scale})` } : undefined}>
        <ul ref={listRef}>
          {roots.map((root) => (
            <OrgNode key={root.id} node={root} depth={0} controls={controls} />
          ))}
        </ul>
      </div>
      {selectedMember && <MemberModal member={selectedMember} onClose={closeMember} />}
    </div>
  )
}

export default OrgChart
